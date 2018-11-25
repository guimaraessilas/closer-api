var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://fddqwgcsigiqfq:fb6e444bf55dfcfef654ce13c9aa7da8df345403a0fcce2c085664c81a5ee5b5@ec2-54-163-230-178.compute-1.amazonaws.com:5432/dacn6p0tcppp9i';
const db = pgp(connectionString);

//query functions
function listUsers(req, res, next) {
    console.log('get all users')
    db.many('select id, username, email, birth_date, profile_photo_path, fullname from user_profile')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Retrieved ALL users',
                    data: data,
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function findUser(req, res, next) {
    console.log("get single user");
    db.many(`select id, username, email, birth_date, profile_photo_path, fullname from user_profile where email='${req.params.search}' or username like '%${req.params.search}%'`, req.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Retrieved single user',
                    data: data,
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function findUserByEmail(req, res, next) {
    console.log("get single user");
    db.many(`select id, username, email, birth_date, profile_photo_path, fullname from user_profile where email='${req.params.email}'`, req.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Retrieved single user',
                    data: data,
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createUser(req, res, next) {
    console.log('sign up')
    db.none(`insert into user_profile(username, fullname, email, password, birth_date)` +
            `values('${req.body.username}', '${req.body.fullname}', '${req.body.email}', '${req.body.password}', '${req.body.birth_date}')`,
            req.body)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one user'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateUser(req, res, next) {
    console.log(`update user_profile set username='${req.body.username}', birth_date='${req.body.birth_date}', current_location='${req.body.current_location}', email='${req.body.email}', password='${req.body.password}' , bio='${req.body.bio}', profile_photo_path='${req.body.profile_photo_path}' where id=${parseInt(req.body.id)}`);

    db.any(`update user_profile set username='${req.body.username}', birth_date='${req.body.birth_date}', current_location='${req.body.current_location}', email='${req.body.email}', password='${req.body.password}' , bio='${req.body.bio}', profile_photo_path='${req.body.profile_photo_path}' where id=${parseInt(req.body.id)}`,
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated user'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

function login(req, res, next) {
    console.log('login')
    db.any(`select * from user_profile where (email like '${req.body.email}' or username like '${req.body.username}') and password like '${req.body.password}'`,
            req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Login realizado',
                    data: data
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    listUsers: listUsers,
    findUser: findUser,
    findUserByEmail: findUserByEmail,
    createUser: createUser,
    login: login,
    updateUser: updateUser
};