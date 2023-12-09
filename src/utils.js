import path from "path"
import { fileURLToPath } from "url"
import passport from "passport"
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

export const passportCall = (strategy) => {
    return async(req, res, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}
export const authorization= (role) => {
    return async(req, res, next)=>{
        if(!req.user) return res.status(401).send({error: "Unauthorized"})
        if(req.user.role!= role) return res.status(403).send({error:"No permissions"})
        next()
    }
}
export const transport= nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:'asdribelb@gmail.com',
        pass:'fyeb yqwu hblz izxy'
    }
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname