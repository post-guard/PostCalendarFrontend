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

          <div>
            <MailOutlined style="float: left; margin: 5px; margin-left: 20px;" />
            <h3 style="float: left;">: {{ userStore.user?.emailAddress }}</h3>
          </div>
        </div>
      </a-col>

      <a-col :span="16">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          style="line-height: 64px;"
        >
          <a-menu-item key="1">所在组织</a-menu-item>
        </a-menu>

        <div style="height: 20px;"></div>

        <div>
          <a-table
            :columns="columns"
            :data-source="groups">

          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { IGroup } from '@/models/IGroup';
import type { IUserGroupLink } from '@/models/IUserGroupLink';
import { useUserStore } from '@/stores/UserStore';
import { Request } from '@/utils/Request';
import { MailOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

class Column {
  public title: String;
  public key: String;
  public dataIndex: String;

  constructor(title: String, key: String) {
    this.title = title;
    this.key = key;
    this.dataIndex = key;
  }
}

class GroupInformation {
  public name: String;
  public details: String;
  public permission: String;

  public constructor(group: IGroup, groupLink: IUserGroupLink) {
    this.name = group.name;
    this.details = group.details;

    switch (groupLink.permission) {
      case 0:
        this.permission = "用户";
        break;
      case 1:
        this.permission = "管理员";
        break;
      case 2:
        this.permission = "超级管理员";
        break;
      default:
        this.permission = "????";
        break;
    }
  }
}

const userStore = useUserStore();
const request = new Request();
const selectedKeys = ref(['1']);
const groups = ref<GroupInformation[]>([]);
const columns: Column[] = [
  new Column("组织名称", "name"),
  new Column("组织介绍", "details"),
  new Column("权限", "permission"),
  new Column("操作", "action")
];

if (userStore.user != undefined) {
  getGroupInformation(userStore.user.id);
}

/**
 * 获得用户所在组织的信息
 * @param userId 用户ID
 */
async function getGroupInformation(userId: Number) {
  try {
    const linkResponse = await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/user/${userId}`);

    for (const link of linkResponse.data) {
      const groupResponse = await request.get<IGroup>(`/postcalendarapi/group/${link.groupId}`);
      groups.value.push(new GroupInformation(groupResponse.data, link));
    }
  } catch(err) {
    message.error("服务器异常，请联系管理员");
  }
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
