var UserModel = require('./models/user');
var OtpModel = require('./models/otp.model');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'ErRajneesh1987@outlook.com',
        pass: 'Rajn1987'
    }
});





function getUser(res) {
    UserModel.find(function (err, user) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(user); // return all users in JSON format
    });
};

module.exports = function (app) {

    
    
    
    // User login there emil and password.
    app.post('/api/UserLogin', function (req, res) {  
        UserModel.find(req.body.UserLoginEmail).limit(1).exec(function(err, data) {
            if(data[0].Password==req.body.UserLoginPassword){
                res.json(true);
            }
            else{
                res.json(false);
            }
        });
    });
    
    
    


    // otp verfiy with user email
    app.post('/api/otpVerification', function (req, res) {  
        console.log(req.body.UserEmail); 

        OtpModel.find(req.body.UserEmail).sort([['CreatedTime', -1]]).limit(1).exec(function(err, data) {
            console.log(data[0].Otp); 
            if(data[0].Otp==req.body.Otp){
                res.json(true);
            }
            else{
                res.json(false);
            }
        });
    });


    // otp insert into table and send mail to user email
    app.post('/api/otpInsert', function (req, res) {  
        console.log(req.body.Otp); 
        var mailOptions = {
            from: 'ErRajneesh1987@outlook.com',
            to: req.body.UserEmail,
            subject: 'Bita-Exam Otp!!',
            text: 'Your Otp is :-' + req.body.Otp
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json(false);
            } else {
                OtpModel.create({
                    UserEmail: req.body.UserEmail,
                    Otp: req.body.Otp,
                    IsValidate:req.body.IsValidate,
                    CreatedTime:req.body.CreatedTime,
                    done: false
                }, function (err, user) {
                    if (err)
                    {
                        res.send(err);
                    }
                    else
                    {
                        res.json(true);
                    }

                });

            }
        });
    });

    // send mail functions
    app.post('/api/mail', function (req, res) {
        console.log("send mail function working");
    });
 

    // api ---------------------------------------------------------------------
    // get all users
    app.get('/api/users', function (req, res) {
        // use mongoose to get all users in the database
        getUser(res);
    });

    // create users and send back all users after creation
    app.post('/api/create', function (req, res) {
        // create a users, information comes from AJAX request from Angular
        UserModel.create({
            UserEmail: req.body.createUserEmail,
            Password: req.body.createUserFristPassword,
            UserConfirmPassword: req.body.createUserCnfPassword,
            UserOtp: req.body.createUserOtp,
            done: false
        }, function (err, user) {
            if (err){
                res.json(false);
            }else{
                res.json(true);
            }



        });

    });

    // delete a users
    app.delete('/api/user/:user_id', function (req, res) {
        UserModel.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);

            getUser(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
