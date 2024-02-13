"use strict";
const User = require("../models/User");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const { emailValidRegex, strongPasswordRegex } = require("../utils/constants");
const jwt = require("jsonwebtoken");


function generateAccessToken(data, expirationTime) {
    if(expirationTime !== null) 
        return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: `${expirationTime}s` }); 
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

class UserService {
    static async getAll(){
        return await User.getAll();
    }

    static async getById(id){
        const user = await User.getById(id);
        if(user === null)
            throw new Error("User not found");
        return user;
    }

    static async update(id, name, surname, email, password, is_admin){
        const user = await User.getById(id);
        if(user === null)
            throw new Error("User not found");

        if (name !== undefined) user.name = name;
        if (surname !== undefined) user.surname = surname;
        if (email !== undefined) user.email = email;
        if (password !== undefined) {
            user.password = password;
            user.token_reset_time = new Date();
        }
        if (is_admin !== undefined) user.is_admin = is_admin;

        const updatedUser = await user.save();
        if (updatedUser !== null) {
            if (password !== undefined) {
                const token = generateAccessToken({ userId: updatedUser.id, isAdmin: updatedUser.is_admin }, null);
                return { token: token };
            } else {
                return { message: "User updated" };
            }
        } else {
            throw new Error("Error updating user");
        }
    }    

    static async add(name, surname, email, password, is_admin){
        if(!email.match(emailValidRegex))
            throw new Error("Invalid email address");
        if(!password.match(strongPasswordRegex))
            throw new Error("Invalid password");
        if(await User.getByEmail(email) !== null)
            throw new Error("Email already registered");

        const user = new User(null, name, surname, email, password, 0, new Date(), is_admin);

        console.log(user);

        const newUser = await user.save();
        if(newUser !== null) {
            const token = generateAccessToken({ userId: newUser.id, isAdmin: newUser.is_admin }, null);
            return { token: token };
        } else {
            throw new Error("Error adding user");
        }
    }

    static async login(email, password){
        const user = await User.login(email, password);
        if(user === null)
            throw new Error("Invalid credentials");
        const token = generateAccessToken({
            userId: user.id,
            isAdmin: user.is_admin,
        }, null);
        return { token: token };
    }

    static async resetPasswordToken(email){
        if(!email){
            throw new Error("Missing email");
        }
    
        const transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const token = generateAccessToken({
            email: req.body.email
        }, 900);;
    
        const resetPasswordToken = new ResetPasswordToken(null, req.body.email, token, new Date(), false);
        resetPasswordToken.save();
    
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: req.body.email,
            subject: 'Reset your password',
            text: `Hello, you can reset your password here: http://${process.env.API_URL}:${process.env.PORT}/auth/resetPasswordPage?token=${token}`
        };
    
        try{
            await transporter.sendMail(mailOptions);
            return { message: "Email sent" };
        }catch(error){
            throw new Error("Error sending email");
        }
    }

    static async resetPassword(email, password){
        if(!email)
            throw new Error("Missing email ");
        if(!password)
            throw new Error("Missing password");
        if(!password.match(strongPasswordRegex))
            throw new Error("Invalid password");

        let token = await ResetPasswordToken.getByToken(req.query.token);
        if(token === null || token.used)
            throw new Error("Invalid token");
        
    
        const user = await User.getByEmail(req.body.email);
        if (user !== null) {
            token.used = true;
            token.save();
            user.password = password;
            user.token_reset_time = new Date();
            const updatedUser = await user.save();
            if(updatedUser !== null){
                return { message: "Password updated" };
            } else {
                throw new Error("Error updating password");
            }
        } else {
            throw new Error("Email not registered");
        }
    }
}

module.exports = UserService;
