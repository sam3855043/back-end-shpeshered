'use strict';


/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // app.logger.info('启动耗时 %d ms', Date.now() - start);
  const jwt = app.middleware.jwt(app.config.jwt);
  router.get('/', controller.home.index);
  router.get('/news', controller.news.index);
  router.get('/add', controller.news.add);
  router.get('/other', controller.news.other);


  router.get('/InsertMemberData', controller.sherphered.bulkMemberData);

  router.post('/api/v1/login', controller.sherphered.addSherphered);
  router.post('/api/v1/signIn', controller.sherphered.findSherphered);

  router.get('/api/v1/getBeSherpheredList', jwt, controller.sherphered.getBeSherpheredList);
  router.put('/api/v1/updateUser', jwt, controller.sherphered.modifySherphered);
  // router.delete('/api/v1/deleteUser', jwt, controller.sherphered.deleteSherphered);


  router.post('/api/v1/addBeSherphered', jwt, controller.sherphered.addBeSherphered);
  router.get('/findBeSherphered', controller.sherphered.findBeSherphered);


  router.get('/getRandomuser', controller.news.getRandomuser);
  router.get('/crud/index', controller.crud.index);
  router.get('/crud/creat', controller.crud.creat);
  router.get('/cookies-page', controller.cookies.set.index);
  router.resources('posts', '/api/posts', controller.posts);
};
