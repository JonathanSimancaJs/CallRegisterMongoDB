// Archivo encargado de manejar todas las rutas.

module.exports = (app, passport) => {

  //Importando modelos
  const callmodel = require('./models/calls');
  const usermodel = require('./models/users');
  const url = require('url');

  app.get('/', (req, res) => {
    res.render('index');
  })

  //Inicio de sesion

  app.get('/login', (req, res) => {
    res.render('login', {
      message: req.flash('loginMessage')
    });
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/newcall',
    failureRedirect: '/login',
    failureFlash: true
  }));

  //Registro de usuario

  app.get('/signup', (req, res) => {
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/newcall',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // Rutas de la aplicacion

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {
      user: req.user
    });
  });

  app.post('/update', isLoggedIn, (req, res) => {
    let id = req.body.id;
    usermodel.findById(id, (err, users) => {
      if (err) throw err;
      users.nameuser = req.body.name,
      users.save()
        .then(() => res.redirect('/profile'))
    });
  });

  app.get('/newcall', isLoggedIn, (req,res) => {
    res.render('newcall', {
      user: req.user
    });
  })

  app.post('/newcall', isLoggedIn, (req, res) => {
    let body = req.body;
    body.status = false;
    callmodel.create(body, (err, calls) => {
      if (err) throw err;
      res.redirect(url.format({
        pathname:"/showlastcall",
        query: req.body
      }));
    })
  })

  app.get('/showlastcall', isLoggedIn, (req,res) => {
    res.render('showlastcall', {
      qs: req.query,
      user: req.user
    });
  })

  app.get('/history', isLoggedIn, (req, res) => {
    callmodel.find({}, (err, calls) => {
      callmodel.populate(calls, {path : 'user'}, (err, calls) => {
        if(err) throw err;
        res.render('history', {
          calls: calls,
          user: req.user
        });
      });
    });
  });

  app.get('/info', (req, res) => {
    res.render('info', {
      user: req.user
    });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

  //Funcion que comprueba si el usuario se encuentra logueado.
  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    return res.redirect('/');
  }

};
