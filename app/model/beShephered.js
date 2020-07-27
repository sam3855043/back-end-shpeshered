'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const database = app.mongooseDB.get('user');
  const schema = new Schema(
    {
      Name: {
        type: String,
        required: false,
      },
      ID: {
        type: String,
        required: false,
      },
      path: {
        type: String,
        required: false
      },
      sex: {
        type: String,
        required: false
      },
      SherpheredInfo: {
        type: Array,
        required: false
      },
    },
    {
      versionKey: false,
    }
  );

  return database.model('besherphered', schema, 'beshephered');

  /* model syntax
  mongoose.model('xxx', schema,'yyy');
  yyy: 自定义 collection 的名称,不让mongo修改大小写和复数形式
  */
};
