<template>
  <div id="container">
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="4">
        <div id="person_information">
          <a-image class="height-100" src="avatar.png">
          </a-image>

          <div style="text-align: center;">
            <p style="font-size: 20px;">{{ token?.username }}</p>
          </div>

          <a-divider style="color: white;"></a-divider>

          <div>
            <MailOutlined style="float: left; margin: 5px; margin-left: 20px;" />
            <h3 style="float: left;">: {{ token?.emailAddress }}</h3>
          </div>
        </div>
      </a-col>

      <a-col :span="16">

      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { ILoginToken } from '@/models/ILoginToken';
import { WebStorage } from '@/utils/Storage';
import { MailOutlined } from '@ant-design/icons-vue';

const storage = new WebStorage('localStorage');
const token = storage.getKey<ILoginToken>("token");

if (token != null) {

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
