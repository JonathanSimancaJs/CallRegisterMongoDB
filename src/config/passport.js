//Archivo que controla la creación de usuarios, el cifrado de claves y el inicio de sesión.

const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {

  // Sereializa los datos
  passport.serializeUser(function (user, done){
    done(null, user.id);
  })

  //proceso inverso
  passport.deserializeUser(function (id, done){
    User.findById(id, function(err, user) {
      done(err, user);
    })
  })

  //signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, login, password, done){
    User.findOne({'login': login}, function(err, user){
      if (err) { return done(err); }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'El email ya esta en uso.'));
      }else{
        var newUser = new User();
        newUser.login = login;
        newUser.nameuser = null;
        newUser.password = newUser.generateHash(password);
        newUser.save((err) => {
          if (err) {throw err;}
          return done(null, newUser);
        });
      }
    })
  }));

  //Login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, login, password, done){
    User.findOne({'login': login}, function(err, user){
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
      }
      if (!user.validatePassword(password)){
        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));
      }
      return done(null, user);
    })
  }));



}
