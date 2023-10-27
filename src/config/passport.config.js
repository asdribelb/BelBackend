import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import UserManager from "../controllers/UserManager.js";
import GitHubStrategy from "passport-github2";


const LocalStrategy = local.Strategy;
const userMan = new UserManager();

// Inicialización de Passport para estrategia de registro
const initializePassword = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age, rol } = req.body;

            try {
                let user = await userMan.findEmail({ email: username })
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }

                const hashedPassword = await createHash(password);

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    rol
                };

                let result = await userMan.addUser(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al obtener el usuario" + error);
            }
        }));

    // Serialize user para la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

      // Deserialize user a partir del ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userMan.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

    // Estrategia de inicio de sesión local
    passport.use('login', new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userMan.findEmail({ email: username })
            if (!user) {
                console.log("Usuario no existe")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) {
                console.log('Contraseña incorrecta');
                return done(null, false);
              }
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );

    // Estrategia de inicio de sesión con GitHub
    passport.use('github', new GitHubStrategy(
        {
        clientID: "Iv1.0bf2dc136ffa0b07",
        clientSecret: "d90d1a30bf1e7141da5f11235c5fad4d5f62e2fa",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userMan.findEmail({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "GitHub User",
                    age: 20,
                    email: profile._json.email,
                    password: "",
                    rol: "usuario"
                }
                let result = await userMan.addUser(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
    ))
}

export default initializePassword;

