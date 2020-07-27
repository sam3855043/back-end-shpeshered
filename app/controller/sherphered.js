/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
'use strict';

const mockjs = require('mockjs');
const Controller = require('egg').Controller;

class MemberController extends Controller {
  async index() {
    const { ctx, service } = this;
    const roster = await service.mongo.obtain();
    const r = {
      msg: 'news!',
      list: roster,
    };
    ctx.body = `${JSON.stringify(r, null, 2)}`;
  }

  async bulkMemberData() {
    const { ctx, service } = this;
    const { result } = await service.mongo.insertBulk();
    ctx.body = {
      msg: 'success',
      data: result,
    };
  }

  async addSherphered() {
    const { ctx, service } = this;
    const { newuser, randomuser } = await service.mongo.addShereped();
    ctx.body = {
      msg: 'success!',
      data: newuser,
    };
  }

  async modifySherphered() {
    const { ctx, service } = this;
    const result = await service.mongo.modifySherphered();
  }
  async addBeSherphered() {
    const { ctx, service } = this;
    console.log('addBeSherphered');
    const { BeSherphered } = await service.mongo.addBeSherphered();
    const token = this.ctx.header.authorization;
    ctx.body = {
      msg: 'success!',
      data: BeSherphered,
    };
  }
  async getBeSherpheredList() {
    const { ctx, service } = this;
    const list = await service.mongo.getBeSherpheredList();
    console.log('list', list);
    ctx.body = {
      msg: 'success',
      data: list,
    };
  }
  async modifyBeSherphered() {
    const { ctx, service } = this;
    const result = await service.mongo.modifyBeSherphered();
  }
  async findSherphered() {
    const { ctx, service } = this;
    const { msg, data, token } = await service.mongo.findSherphered();
    console.log('result1', msg);
    ctx.body = {
      msg,
      data,
      token
    };
  }
  async findBeSherphered() {
    const { ctx, service } = this;
    const { result } = await service.mongo.findSherered();
    console.log('result1', result);
    ctx.body = {
      msg: 'add!',
      data: result,
    };
  }

}

module.exports = MemberController;

// curl -s http://localhost:7001/news | fx '.'
