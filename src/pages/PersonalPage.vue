<template>
  <div id="container">
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="4">
        <div id="person_information">
          <a-image class="height-100" src="avatar.png">
          </a-image>

          <div style="text-align: center;">
            <p style="font-size: 20px;">{{ userStore.user?.username }}</p>
          </div>

          <a-divider style="color: white;"></a-divider>

          <a-space align="center" size="small" style="margin-left: 5px;">
            <MailOutlined></MailOutlined>
            <p style="font-size: 16px; margin-top: 12px;">{{ userStore.user?.emailAddress }}</p>
          </a-space>
        </div>
      </a-col>

      <a-col :span="16">
        <a-space align="end" size="middle" style="background-color: white;">
          <a-popover title="创建新的组织" trigger="click" placement="bottom" v-model:visible="addGroupVisable">
            <template #content>
              <div style="height: 4px;"></div>
              <p>你会自动称为新成立组织的超级管理员。</p>

              <p>
                <a-input size="middle" placeholder="组织名称" v-model:value="addGroupName">
                </a-input>
              </p>

              <p>
                <a-input size="middle" placeholder="组织简介" v-model:value="addGroupDetail">
                </a-input>
              </p>

              <p>
                <a-button type="primary" size="middle" style="width: 50%;" :disabled="addButtonEnable"
                  @click="addGroupConfirmButtonClicked">
                  <template #icon>
                    <CheckOutlined />
                  </template>
                </a-button>

                <a-button type="danger" size="middle" style="width: 50%;" @click="addGroupCancelButtonClicked">
                  <template #icon>
                    <CloseOutlined />
                  </template>
                </a-button>
              </p>

            </template>
            <a-button>创建组织</a-button>
          </a-popover>
        </a-space>

        <div style="height: 15px;"></div>

        <div>
          <a-table :columns="groupTableColumns" :data-source="groups" :loading="groupTableLoading">

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action' && record.groupLink.permission >= 1">
                <a-button type="link" @click="manageGoupButtonClicked(record.groupLink.groupId)">
                  管理组织
                </a-button>
              </template>
              <template v-if="column.key === 'action'">
                <a-button type="link" @click="leaveGroupButtonClicked(toRaw(record.groupLink))">
                  退出组织
                </a-button>
              </template>
            </template>
          </a-table>
        </div>

        <div style="height: 30px;"></div>

        <div v-if="manageTableVisable">
          <a-space align="end" size="middle" style="background-color: white;">
            <a-button type="primary" @click="manageGroupCloseButtonClicked">
              关闭管理面板
            </a-button>

            <a-button type="primary">
              添加新用户
            </a-button>

            <a-button type="danger">
              删除组织
            </a-button>
          </a-space>

          <div style="height: 15px;"></div>

          <a-table :columns="mangerGroupColumns" :data-source="manageGroupUsers" :loading="manageTableLoading">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key == 'action'">
                <a-button type="link">
                  修改用户权限
                </a-button>

                <a-button type="link">
                  删除用户
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { IGroup } from '@/models/IGroup';
import type { IResponse } from '@/models/IResponse';
import { getPermissionName, type IUserGroupLink } from '@/models/IUserGroupLink';
import type { User } from '@/models/User';
import { useUserStore } from '@/stores/UserStore';
import { Request } from '@/utils/Request';
import { MailOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { AxiosError } from 'axios';
import { computed, ref, toRaw } from 'vue';

class Column {
  public title: string;
  public key: string;
  public dataIndex: string;

  constructor(title: string, key: string) {
    this.title = title;
    this.key = key;
    this.dataIndex = key;
  }
}

/**
 * 组织在用户中的信息
 */
class GroupInformation {
  public groupLink: IUserGroupLink;
  public name: string;
  public details: string;
  public permissionName: string;

  public constructor(group: IGroup, groupLink: IUserGroupLink) {
    this.groupLink = groupLink;
    this.name = group.name;
    this.details = group.details;
    this.permissionName = getPermissionName(groupLink.permission);
  }
}

/**
 * 用户在组织中的信息
 */
class UserInformation {
  public groupLink: IUserGroupLink;
  public name: String;
  public emailAddress: String;
  public permissionName;

  public constructor(user: User, groupLink: IUserGroupLink) {
    this.groupLink = groupLink;
    this.name = user.username;
    this.emailAddress = user.emailAddress;
    this.permissionName = getPermissionName(groupLink.permission);
  }
}

const userStore = useUserStore();
const request = new Request();
const groupTableLoading = ref(false);
const groups = ref<GroupInformation[]>([]);
const addGroupName = ref("");
const addGroupDetail = ref("");
const addGroupVisable = ref(false);
const manageTableVisable = ref(false);
const manageTableLoading = ref(false);
const manageGroupUsers = ref<UserInformation[]>([]);

const groupTableColumns: Column[] = [
  new Column("组织名称", "name"),
  new Column("组织介绍", "details"),
  new Column("权限", "permissionName"),
  new Column("操作", "action")
];
const mangerGroupColumns: Column[] = [
  new Column("用户名称", "name"),
  new Column("电子邮件地址", "emailAddress"),
  new Column("权限", "permissionName"),
  new Column("操作", "action")
]

// 确认添加组织按钮按下式输入内容合法
const addButtonEnable = computed(() => {
  return addGroupName.value.length == 0 || addGroupDetail.value.length == 0;
});

refreshGroupTable();

/**
 * 刷新当前用户所在组织的列表
 */
async function refreshGroupTable() {
  if (userStore.user != undefined) {
    groupTableLoading.value = false;
    groups.value.length = 0;

    try {
      const linkResponse = await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/user/${userStore.user.id}`);

      for (const link of linkResponse.data) {
        const groupResponse = await request.get<IGroup>(`/postcalendarapi/group/${link.groupId}`);
        groups.value.push(new GroupInformation(groupResponse.data, link));
      }
      groupTableLoading.value = false;
    } catch (err) {
      message.error("服务器异常，请联系管理员");
    }
  }
}

async function refreshGroupManageTable(groupId:number) {
  manageGroupUsers.value.length = 0;
  manageTableLoading.value = true

  try {
    const linkResponse = await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/group/${groupId}`);

    for (const link of linkResponse.data) {
      const userResponse = await request.get<User>(`/postcalendarapi/user/${link.userId}`);
      manageGroupUsers.value.push(new UserInformation(userResponse.data, link));
    }

    manageTableLoading.value = false;
  } catch(err) {
    message.error("服务器异常，请联系管理员");
  }
}

/**
 * 点击离开组织按钮调用的方法
 * @param groupLink 需要离开的组织信息
 */
async function leaveGroupButtonClicked(groupLink: IUserGroupLink) {
  try {
    await request.delete<IUserGroupLink>(`/postcalendarapi/groupLink/group/${groupLink.groupId}`);

    message.info(`退出组织${groupLink.groupId}成功`);

    refreshGroupTable();
  } catch (err) {
    const axiosError = err as AxiosError<IResponse<IUserGroupLink>>;

    let hint = "服务器错误，请联系管理员";
    if (axiosError.response?.status != undefined
      && axiosError.response.status >= 400 && axiosError.response.status < 500) {
      if (axiosError.response.data.message != undefined) {
        hint = axiosError.response.data.message;
      }
    }
    message.error(hint);
  }
}

/**
 * 点击添加按钮调用的方法
 */
async function addGroupConfirmButtonClicked() {
  addGroupVisable.value = false;

  try {
    await request.post<IGroup>("/postcalendarapi/group/", {
      name: addGroupName.value,
      details: addGroupDetail.value
    });

    message.info("创建组织成功");

    addGroupName.value = "";
    addGroupDetail.value = "";

    refreshGroupTable();
  } catch (err) {
    const axiosError = err as AxiosError<IResponse<IGroup>>;
    let hint = "服务器错误， 请联系管理员";
    console.log(err);

    if (axiosError.response?.status != undefined
      && axiosError.response.status >= 400 && axiosError.response.status < 500) {
      if (axiosError.response.data.message != undefined) {
        hint = axiosError.response.data.message;
      }
    }

    message.error(hint);
  }
}

function addGroupCancelButtonClicked() {
  // 清空输入栏中的文字
  addGroupName.value = "";
  addGroupDetail.value = "";

  addGroupVisable.value = false;
}

function manageGoupButtonClicked(groupId: number) {
  manageTableVisable.value = true;

  refreshGroupManageTable(groupId);
}

function manageGroupCloseButtonClicked() {
  manageTableVisable.value = false;
}


</script>

<style scoped>
#container {
  padding: 20px;
  margin: 20px;

}

#description h1 {
  font-size: 24px;
}

#person_information {
  border-style: solid;
  border-width: 1px;
  border-color: rgb(209, 208, 208);
}

#person_information::after {
  content: '';
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
</style>
