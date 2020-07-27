/* eslint-disable no-unused-vars */
'use strict';

const Service = require('egg').Service;
const Mock = require('mockjs');
const Random = Mock.Random;
const jwt = require('jsonwebtoken');
function initUserData(roster) {}
class MongoService extends Service {
  async obtain() {
    try {
      const result = await this.ctx.model.UserModel.find();
      return result;
    } catch (error) {
      return [];
    }
  }
  /**
   * Sherphered Service
   */
  async insertBulk() {
    try {
      // const result = await this.ctx.model.memberData.insertMany([{}])
      // console.log('this.ctx.query', this.ctx.request.body);
      const memberData = this.ctx.request.body.members.map(function(item) {
        return { Name: item.member_name, ID: item.member_id, path: item.path, sex: item.sex };
      });
      // console.log('memberData', memberData);
      const result = await this.ctx.model.MemberData.insertMany(memberData);
      // console.log('bulkMemberData', result);
      return { result };
    } catch (error) {
      console.log('error insertBulk', error);
      return [];
    }
  }
  // sign In Sherphered 
  async findSherphered() {
    try {
      // find sherphered one 1.name(account) 2.password
      let msg;
      let token;
      const data = await this.ctx.model.Sherphered.find({ account: this.ctx.query.account, password: this.ctx.query.password });
      if (data.length === 0) {
        msg = 'no account';
      }
      else {
        msg = 'success';
        // token = jwt.sign({
        //   data: 'foobar'
        // }, 'secret', { expiresIn: 60 * 60 });
        token = this.ctx.app.jwt.sign( this.ctx.request.query, this.app.config.jwt.secret, { expiresIn: '1h' });
        //  token签名 有效期为1小时
      }
      return { msg, data, token };
    } catch (error) {
      console.log('error1', error);
      return [];
    }
  }

  async addShereped() {
    console.log('ctx', this.ctx.query);
    const user = new this.ctx.model.Sherphered({
      address: '',
      zip: '',
      city: '',
      gender: '',
      ShepherdPhone: '',
      country: '',
      ShepherdID: '',
      ChildrenInfo: [{}],
      email: '',
      phone: '',
      account: this.ctx.query.account,
      password: this.ctx.query.password,
      Name: this.ctx.query.user,
      ID: this.ctx.query.id,
    });
    try {
      const res = await user.save();
      console.log('res', res);
      if (res && res._id) {
        return {
          newuser: res,
          randomuser: this.ctx.query.user,
        };
      }
      return [];
    } catch (error) {
      console.log('error1', error);
      return [];
    }
  }
  async modifySherphered() {
    const data = await this.ctx.model.UserModel.find({ Name: this.ctx.query.user });
    const tmp = data.ShepherdInfo;
    tmp.push({
      name: this.ctx.query.beSherephedName,
      ID: this.ctx.query.beSherephedID,
      _id: this.ctx.query.beSherephed_id,
    });
    // tmp.push(this.ctx.query.ShepherdName);
    // tmp1.push(this.ctx.query.ShepherdID);
    const ReturnData = await this.ctx.model.UserModel.update({ Name: this.ctx.query.user }, {
      $set: {
        SherepherdInfo: tmp
      }
    });
    console.log(ReturnData);
    return { ReturnData };
  }
  async getBeSherpheredList() {
    console.log('getBeSherpheredList');
    // let decode = this.ctx.app.jwt.verify(token, options.secret);
    console.log('this.app.config.jwt', this.app.config.jwt);
    const token = this.ctx.request.header.authorization;
    let decode = this.ctx.app.jwt.verify(token, this.app.config.jwt);
    console.log('decode', decode);
    const list = this.ctx.model.BeShephered.find({ SherpheredInfo: { $elemMatch: { account: decode.account } } });
    //const list = this.ctx.model.BeShephered.find();                               
    // console.log('list1', list);
    return list;
  }
  async addBeSherphered() {
    const BeSherphered = new this.ctx.model.BeShephered({
      address: '',
      zip: '',
      city: '',
      gender: '',
      ShepherdPhone: '',
      country: '',
      ShepherdID: '',
      SherpheredInfo: [{ account: this.ctx.query.sherpheredAccount, Name: this.ctx.query.sherpheredName, ID: this.ctx.query.sherpheredID, _id: this.ctx.query.sherphered_id }],
      email: '',
      phone: '',
      title: '',
      Name: this.ctx.query.beSherpheredName,
      ID: this.ctx.query.beSherpheredNameID,
    });
    try {
      const res = await BeSherphered.save();
      if (res && res._id) {
        return {
          BeSherphered: res,
        };
      }
      return { BeSherphered };
    } catch (error) {
      return [];
    }

  }
  async modifyBeSherphered() {
    const data = await this.ctx.model.UserModel.find({ Name: this.ctx.query.user });
    const tmp = data.ShepherdInfo;
    tmp.push({
      name: this.ctx.query.beSherephedName,
      ID: this.ctx.query.beSherephedID,
      _id: this.ctx.query.beSherephed_id,
    });
    // tmp.push(this.ctx.query.ShepherdName);
    // tmp1.push(this.ctx.query.ShepherdID);
    const ReturnData = await this.ctx.model.UserModel.update({ Name: this.ctx.query.user }, {
      $set: {
        SherepherdInfo: tmp
      }
    });
    console.log(ReturnData);
    return { ReturnData };
  }
  async getRandomuser() {
    const api = this.config.userDataInterface;
    //  Services call each other
    const data = await this.ctx.curl(api, {
      dataType: 'json',
    });
    return data || {};
  }
  async add() {
    const getRandomuser = await this.service.mongo.getRandomuser();
    const rUser = getRandomuser.data.results[0];
    console.log('rUser: ', rUser);

    const user = new this.ctx.model.UserModel({
      address: Random.county(true),
      zip: Random.zip(),
      gender: rUser.gender,
      country: rUser.location.country,
      longitude: rUser.location.coordinates.longitude,
      latitude: rUser.location.coordinates.latitude,
      email: rUser.email,
      phone: rUser.phone,
      title: rUser.name.title,
      firstName: rUser.name.first,
      lastName: rUser.name.last,
      picture: rUser.picture.large,
    });

    try {
      const res = await user.save();
      if (res && res._id) {
        return {
          newuser: res,
          randomuser: rUser,
        };
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async creat() {
    const user = new this.ctx.model.UserModel(
      Mock.mock({
        'gender|1': ['male', 'female'],
        address: '@county(true)',
        zip: '@zip()',
        email: '@email',
        province: '@province',
        latitude: '@string("number", 5)',
        longitude: '@string("number", 5)',
        phone: 'number|1-100',
        title: '@title(2)',
        firstName: '@first',
        lastName: '@last()',
        picture: '@url()',
      })
    );
    try {
      const res = await user.save();
      console.log('user.save: ', res);
      if (res && res._id) {
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async other() {
    const arr = this.ctx.model.UserModel;
    try {
      // eg: 查询100000 <= x <=300000范围
      const f_range = { zip: { $lte: 300000, $gte: 100000 } };
      const f_accurate = { zip: '906148' };
      const f_accurate2 = { num: '906148' };
      const f_enum = { zip: { $in: ['906148', 276451, 668561] } };
      const f_nin_enum = { zip: { $nin: ['906148', 276451, 668561] } };
      const f_miss_picture = { picture: null };

      const f_or = { $or: [f_accurate, f_accurate2] };

      const o_removeObjectId = { _id: 0 };
      const o_removeVersionNum = { __v: 0 };

      const filter = f_miss_picture;

      const options = {} || {
        ...o_removeObjectId,
        ...o_removeVersionNum,
      };

      const res = await arr.find(filter, options);
      return res || [];
    } catch (error) {
      return [];
    }
  }
}

module.exports = MongoService;
