'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const database = app.mongooseDB.get('user');
  const schema = new Schema(
    {
      address: {
        type: String,
        required: false,
      },
      zip: {
        type: String,
      },
      city: {
        type: String,
        required: false,
      },
      gender: {
        type: String,
        required: false,
      },
      ShepherdPhone: {
        type: Array,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      ShepherdInfo: {
        type: Array,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
      account: {
        type: String,
        required: false,
      },
      password: {
        type: String,
        required: false
      },
      Name: {
        type: String,
        required: false,
      },
      ID: {
        type: String,
        required: false,
      },
    },
    {
      versionKey: false,
    }
  );

  return database.model('shepher', schema, 'shepher');

  /* model syntax
  mongoose.model('xxx', schema,'yyy');
  yyy: 自定义 collection 的名称,不让mongo修改大小写和复数形式
  */
};
