const db = require('../Config/dbConfig');
const { Sequelize, where } = require('sequelize');

const fs = require('fs');
const path = require('path');

const transporter = require('../Config/nodemailerConfig');

const { validationResult } = require("express-validator");

const bcrypt = require('bcrypt'); // for hashing the password
const saltRounds = 10;

const moment = require('moment');
const multer = require('multer'); // for uploading the photo

//const nodemailer = require('nodemailer'); // sending mail to any user
//const randomstring = require('randomstring'); // generate random token

const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');  // generating random token
const projectAssign = require('../Models/projectAssign');
const task = require('../Models/task');
const Mp = Sequelize.Op;

const Org = db.orgs;
const User = db.user;
const Dept = db.dept;
const Role = db.role;
const Project = db.project;
const Task = db.task;
const Priority = db.priority;
const Status = db.status;
const Notes = db.notes;
const Client = db.client;
const ProjectAssign = db.projectAssign;
const OrgUsers = db.orgUser;
const TaskCategory = db.taskCategory;
const TaskAssign = db.taskAssign;
const Report = db.report;

// Profile_Pic Upload by using MULTER  :- ✔
var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const directory = `./Public/`//${req.query.userId}
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }

        cb(null, directory)
    },
    filename: function (req, file, callback) {

        const ext = file.mimetype.split('/')[1];
        callback(null, `User-${Date.now()}.${ext}`);
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
        }
        cb(null, true);
    }
}).single("profile");

exports.updateProfilePic = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (req.fileValidationError) {
                return res.status(200).json({ success: 0, message: req.fileValidationError });
            }
            else if (req.file) {
                const ext = path.extname(req.file.originalname);
                let profilepath = `Public/${Date.now()}${ext}`;
                const profile = `./Public/`;
                const directory = path.join(path.dirname(require.main.filename), profilepath);
                console.log('directory', directory);
                const user = await User.findOne({
                    where: {
                        id: req.body.userId
                    }
                });
                if (user) {
                    const filePath = ("Public", User.profilePic)

                    // if (fs.existsSync(filePath)) {
                    //   fs.unlinkSync(filePath);
                    // } else {
                    //   fs.mkdirSync(profile, { recursive: true });
                    // }
                    // require("fs").writeFile(directory, parseInt(nextBlock, 10).toString(), function (err) { });
                    // req.file.buffer
                    const result = await User.update({
                        profile: profilepath //Date.now() + ext
                    }, {
                        where: {
                            id: req.body.userId
                        }
                    });
                    if (result) {
                        return res.status(200).json({ success: 1, message: "User Profile Updated successfully!" });
                    }
                    else {
                        return res.status(200).json({ success: 0, message: "User Profile Update Failed." });
                    }
                } else {
                    return res.status(200).json({ success: 0, message: "User Not found." });
                }
            }
            else {
                return res.status(200).json({ success: 0, message: "Error while uploading file." });
            }
        });
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
}

// organisation api :- ✔
exports.orgRegistration = async (req, res) => {
    const currentDate = new Date(Date.now()).toISOString().split('T')[0];
    const emailExist = await Org.findOne({ where: { orgEmail: req.body.email } })
    try {
        if (emailExist) {
            res.status(200).json({ success: 0, message: "email Already Exists" });
        } else {
            bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const theData = await Org.create({
                        orgName: req.body.name,
                        orgEmail: req.body.email,
                        contact: req.body.contact,
                        address: req.body.address,
                        password: hash
                    })
                        .then(async (theData) => {
                            if (theData) {
                                await User.create({
                                    name: req.body.name,
                                    email: req.body.email,
                                    address: req.body.address,
                                    contact: req.body.contact,
                                    joinDate: currentDate,
                                    password: hash,
                                    roleId: 1,
                                    deptId: 10,
                                    isSuperAdmin: 1
                                })
                                    .then(async (theData2) => {
                                        if (theData2) {
                                            await OrgUsers.create({
                                                orgId: theData.id,
                                                userId: theData2.id
                                            })
                                        }
                                    })
                                theData.password = undefined;
                                res.status(200).json({ dataIs: theData, message: "Organization table data added successfully" });
                            } else {
                                res.status(200).json({ dataIs: theData, message: "Failed to add Organization" });

                            }
                        })
                })
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// employee register api :- ✔
exports.registerUserApi = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).json({ message: errors.array()[0].msg });
            return;
        } else {
            const emailExist = await User.findOne({ where: { email: req.body.email } })
            if (emailExist) {
                res.status(200).json({ success: 0, message: "Email Already Exists" });
            } else {
                bcrypt.genSalt(saltRounds, async function (err, salt) {
                    bcrypt.hash(req.body.password, salt, async function (err, hash) {
                        const inputData = await User.create({
                            name: req.body.name,
                            gender: req.body.gender,
                            email: req.body.email,
                            address: req.body.address,
                            contact: req.body.contact,
                            dob: req.body.dob,
                            joinDate: req.body.joinDate,
                            password: hash,
                            roleId: req.body.roleId,
                            deptId: req.body.deptId,
                        })
                            .then(async (theData) => {
                                if (theData) {
                                    await OrgUsers.create({
                                        orgId: req.body.orgId,
                                        userId: theData.id
                                    })
                                    theData.password = undefined;
                                    res.status(200).json({ success: 1, message: "user table data added successfully", data: theData });
                                }
                            })
                    })
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// user login api :- ✔
exports.userLogin = async (req, res) => {
    try {
        const emailExist = await OrgUsers.findOne({
            attributes: [
                [Sequelize.col('"tblUser"."name"'), "name"],
                [Sequelize.col('"tblUser"."email"'), "email"],
                [Sequelize.col('"tblUser"."gender"'), "gender"],
                [Sequelize.col('"tblUser"."dob"'), "dob"],
                [Sequelize.col('"tblUser"."joinDate"'), "joinDate"],
                [Sequelize.col('"tblUser"."address"'), "address"],
                [Sequelize.col('"tblUser"."contact"'), "contact"],
                [Sequelize.col('"tblUser"."profile"'), "profile"],
                [Sequelize.col('"tblUser"."password"'), "password"],
                [Sequelize.col('"tblUser"."roleId"'), "roleId"],
                "orgId",
                "userId"
            ],
            include: [
                {
                    model: User,
                    as: "tblUser",
                    where: { email: req.body.email },
                    attributes: []
                }
            ],
            raw: true
        })

        if (!emailExist) {
            res.status(200).json({ success: 0, message: "user does not exist" })
        } else {
            bcrypt.compare(req.body.password, emailExist.password, (err, result) => {
                if (result) {
                    emailExist.password = undefined;
                    return res.status(200).json({
                        success: 1, msg: "Login success", data: emailExist
                    })
                } else {
                    return res.status(200).json({ success: 0, msg: "Invalid credential" })
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message })
    }
}

// department create api :- ✔
exports.deptApi = async (req, res) => {
    try {
        const data1 = await Dept.create({
            deptName: req.body.deptName
        })
        res.status(200).json({ success: 1, data: data1, message: "Department data added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message });
    }
}

// role create api :- ✔
exports.roleApi = async (req, res) => {
    try {
        const data2 = await Role.create({
            roleName: req.body.roleName
        })
        res.status(200).json({ success: 1, data: data2, message: "Role data added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message });
    }
}

// Drop down api of dept :- ✔
exports.deptList = async (req, res) => {
    try {
        const showData = await Dept.findAll({
            attributes: ['id', 'deptName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// Drop down api of role :- ✔
exports.roleList = async (req, res) => {
    try {
        const showData = await Role.findAll({
            attributes: ['id', 'roleName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// show employee details :- ✔
exports.showEmpDetails = async (req, res) => {
    try {
        const showData = await User.findAll({
            attributes: ['id', 'name', 'email', 'gender', 'dob', 'joinDate', 'deptId', 'roleId', 'contact', 'address'],
            include: [
                {
                    model: Dept, attributes: ['deptName']
                },
                {
                    model: Role, attributes: ['roleName']
                }
            ]
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// get user Detail :- ✔
exports.getUserDetail = async (req, res) => {
    try {
        const showData = await User.findAll({
            attributes: ['name', 'email', 'gender', 'dob', 'joinDate', 'address', 'contact', 'profile',
                // [Sequelize.col('"tbl_dept.dept_name","dept_name"')],
                // [Sequelize.col('"tbl_role.role_name","role_name"')]
            ],
            include: // join two tables with User_tbl
                [
                    {
                        model: Dept, attributes: ['deptName']
                    },
                    {
                        model: Role, attributes: ['roleName']
                    }
                ],
            where: { id: req.body.userId },
            raw: true
        });
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// update user api :- ✔
exports.updateUser = async (req, res) => {
    const emailExist = await User.findOne({ where: { email: req.body.email } })
    try {
        if (!emailExist) {
            res.status(200).json({ success: 0, message: "Can't Update, email not exist" });
        } else {
            bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const updateData = await User.update({
                        name: req.body.name,
                        roleId: req.body.roleId,
                        deptId: req.body.deptId,
                        dob: req.body.dob,
                        gender: req.body.gender,
                        address: req.body.address,
                        contact: req.body.contact,
                    },
                        {
                            where: { id: req.body.id },
                        })
                    updateData.password = undefined;
                    res.status(200).json({ success: 1, dataIs: updateData, message: "updated succesfully" });
                })
            })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, errorMsg: error.message });
    }
}

// delete user api :- ✔
exports.deleteUser = async (req, res) => {
    try {
        await Notes.destroy(
            {
                where: { userId: req.body.id },
            });

        await TaskAssign.destroy(
            {
                where: { userId: req.body.id },
            });

        await ProjectAssign.destroy(
            {
                where: { userId: req.body.id },
            });

        await OrgUsers.destroy(
            {
                where: { userId: req.body.id },
            });

        const deleteData = await User.destroy(
            {
                where: { id: req.body.id },
            });
        res.status(200).json({ success: 1, data: deleteData, message: "deleted succesfully" })
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// org list :- ✔
exports.orgList = async (req, res) => {

    try {
        const dataShow = await Org.findAndCountAll({ where: { orgEmail: req.body.orgEmail } })

        if (dataShow.count > 0) {
            res.status(200).json({ showingDetails: dataShow.rows, message: "data shown successfully" });
        } else {
            res.status(200).json({ message: "organisation email are invalid" });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// search user api :- ✔
exports.searchUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).json({ message: errors.array()[0].msg });
            return;
        } else {
            const { email, orgId } = await req.body;
            const showData = await User.findAll({
                where: {
                    orgId: orgId,
                    email: { [Op.iLike]: `%${email}%` }
                }
            })
            if (showData.length != 0) {
                res.status(200).json({ success: 1, showingUser: showData, message: "data search successfully" });
            } else {
                res.status(200).json({ success: 0, showingUser: showData, message: "users not found" });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// Forgot Password - Generate token and send reset link  :- ✔
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token and expiry
        const resToken = uuidv4();
        const resTokenExpiry = Date.now() + 3600000; // 1 hour

        // Update user with reset token and expiry
        await user.update({ resToken, resTokenExpiry });

        // TODO: Send reset link to user's email (use nodemailer or similar)

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'bloodyindiansparrow@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Password Reset Link :- ",
            text: `You are receiving this because you have requested the reset of the password for your account.\n\n`, // plain text body

            html: `<b>PASSWORD RESET LINK :- </b>\n\n`

                + `http://${req.headers.host}/resetPassword?TOKEN=${resToken}`

                + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        });
        console.log("Email Sent:%s", info.messageId);

        res.status(200).json({ message: 'Reset link sent successfully' });

    } catch (err) {
        console.error(err);
        res.status(200).json({ message: 'Server Error' });
    }
};

// Reset Password - Validate token and update password :- ✔
exports.resetPassword = async (req, res) => {

    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            where: {
                resToken: token,
                resTokenExpiry: { [Mp.gt]: Date.now() },
            }
        });

        if (!user) {
            return res.status(200).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear reset token fields
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(200).json({ message: 'Server Error' });
    }
};

// Change password :- ✔
exports.changePassword = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).json({ message: errors.array()[0].msg });
            return;
        }
        else {
            User.findOne({
                where: {
                    id: req.body.userId
                }
            })
                .then(async User => {
                    // console.log(req.body.UserId);
                    if (User) {
                        var passwordIsValid = bcrypt.compareSync(
                            req.body.oldPassword,
                            User.password
                        );
                        if (!passwordIsValid) {
                            return res.status(200).json({ "success": 0, message: "Old Password does not match!" });
                        }
                        else {
                            var pass1 = req.body.newPassword
                            var pass2 = req.body.confirmPassword

                            if (pass1 != pass2) {
                                return res.status(200).json({ "success": 0, message: "Confirmation password does not match new password" });
                            }
                            else if (pass1 == pass2) {
                                await User.update({
                                    password: bcrypt.hashSync(pass2, 10)
                                },
                                    { where: { id: req.body.userId } })

                                return res.status(200).json({ "success": 1, message: "Password Changed Successfully" });
                            }
                            else {
                                return res.status(200).json({ "success": 0, message: "New password does not match" });
                            }
                        }
                    }
                    else {
                        res.status(200).json({ "success": 0, message: "User Not found." });
                    }
                })
                .catch(err => {
                    res.status(200).json({ message: err.message });
                });
        }
    }
    catch (err) {
        return next(err);
    }
};

// TASK
// create priority :- ✔
exports.tskPriorityApi = async (req, res) => {
    try {
        const data1 = await Priority.create({
            priorityName: req.body.priorityName
        })
        res.status(200).json({ success: 1, data: data1, message: "priorities data added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// create status :- ✔
exports.tskStatusApi = async (req, res) => {
    try {
        //console.log(req.body);
        const data1 = await Status.create({
            statusName: req.body.statusName
        })
        res.status(200).json({ success: 1, data: data1, message: "status data added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// task priority list :- ✔
exports.tskPriorityList = async (req, res) => {
    try {
        const showData = await Priority.findAll({
            attributes: ['id', 'priorityName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// task status list :- ✔
exports.tskStatusList = async (req, res) => {
    try {
        const showData = await Status.findAll({
            attributes: ['id', 'statusName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// Create category 
exports.tskCategoryApi = async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(200).json({ success: 0, message: errors.array()[0].msg });
        // }

        const data = await TaskCategory.create({
            tskCategoryName: req.body.tskCategoryName
        });
        res.status(200).json({ success: 1, data: data, message: "Task Category added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// Create Task and assign :- ✔
exports.createTaskApi = async (req, res) => {
    try {
        const data = await Task.create({
            taskName: req.body.taskName,
            taskDesc: req.body.taskDesc,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            proId: req.body.proId,
            priorityId: req.body.priorityId,
            statusId: 1,
            categoryId: req.body.categoryId
        })
            // task assign to user
            // const proId = req.body.proId;
            // const statusId = 1;
            // for (const uId of req.body.userId) {
            //     const develop = await TaskAssign.findOne({
            //         where:
            //         {
            //             proId: proId,
            //             userId: uId
            //         }
            //     });
            //     if (!develop) {
            //         await TaskAssign.create({
            //             taskId: data.id,
            //             proId: proId,
            //             statusId: statusId,
            //             userId: uId
            //         });
            //     }
            // }
            // res.status(200).json({ success: 1, message: "task created & assigned successfully" });

            .then(async (theData) => {
                const statusId = 1;
                if (theData) {
                    for (const uId of req.body.userId) {
                        await TaskAssign.create({
                            taskId: theData.id,
                            proId: req.body.proId,
                            userId: uId,
                            statusId: statusId,
                        }).then(async () => {
                            const userdetails = await User.findOne({
                                where: { id: uId }
                            })
                            // theData.dataValues.userName = userdetails.name
                            // console.log(theData);
                        })
                    }

                    res.status(200).json({ success: 1, data: theData, message: "Task created successfully" });
                }
            })

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// task list :- 
exports.getTask = async (req, res) => {
    try {
        const showData = await TaskAssign.findAll({
            attributes: ['userId',
                [Sequelize.col('"tblStatus"."statusName"'), "statusName"],
                [Sequelize.col('"tblUser"."name"'), "name"],
                [Sequelize.col('"tblTask"."id"'), "taskId"],
                [Sequelize.col('"tblTask"."taskName"'), "taskName"],
                [Sequelize.col('"tblTask"."startDate"'), "startDate"],
                [Sequelize.col('"tblTask"."endDate"'), "endDate"],
            ],
            include: [
                {
                    model: Status,
                    as: "tblStatus",
                    attributes: []
                },
                {
                    model: User,
                    as: "tblUser",
                    attributes: []
                },
                {
                    model: Task,
                    as: "tblTask",
                    attributes: []
                }
            ],
            where: ({
                userId: req.body.userId
            }),
            raw: true
        }).then(async (Tasks) => {
            if (Tasks) {
                const presentDate = moment(new Date());
                const momentDate = presentDate.format('YYYY-MM-DD');

                let overdue = 0 // no
                for (const task of Tasks) {
                    // console.log(task.endDate);
                    if (task.statusName == 1 && task.endDate >= momentDate) {
                        overdue = 0 // no
                    } else if (task.statusName == 1) {
                        overdue = 1 //yes
                    }
                    task.overDue = overdue
                }
            }
            res.status(200).json({ success: 1, data: Tasks });
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message });
    }
}

// task Category list  :-
exports.tskCategoryList = async (req, res) => {
    try {
        const showData = await TaskCategory.findAll({
            attributes: ['id', 'tskCategoryName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// Create Notes :-
exports.createNotes = async (req, res) => {
    try {
        const data = await User.findOne({ where: { id: req.body.userId } })
        if (!data) {
            res.status(200).json({ success: 0, message: "User not exist" });
        }
        else {
            const createnote = await Notes.create({
                notesName: req.body.notesName, userId: req.body.userId
            })
            res.status(200).json({ success: 1, data: createnote, message: "Notes created successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// update notes :-
exports.updateNotes = async (req, res) => {
    try {
        const data = await Notes.update({
            notesName: req.body.notesName
        },
            {
                where: { id: req.body.id },
            })
        res.status(200).json({ success: 1, data: data, message: "Notes updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// delete notes :-
exports.deleteNotes = async (req, res) => {
    try {
        const data = await Notes.destroy({
            where: { id: req.body.id },
        })
        res.status(200).json({ success: 1, data: data, message: "Notes deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// Add client Api :-
exports.addClientApi = async (req, res) => {
    try {
        const data = await Client.create({
            clientName: req.body.clientName
        })
        res.status(200).json({ success: 1, data: data, message: "Client Name created successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// drop down client api :-
exports.clientList = async (req, res) => {
    try {
        const showData = await Client.findAll({
            attributes: ['id', 'clientName']
        })
        res.status(200).json({ success: 1, data: showData });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

//create project and assign api :-
exports.projectApi = async (req, res) => {
    try {
        const data = await Project.create({
            proName: req.body.proName,
            proDesc: req.body.proDesc,
            startDate: req.body.startDate,
            deadLine: req.body.deadLine,
            proLead: req.body.proLead,
            deptId: req.body.deptId,
            clientId: req.body.clientId,
            orgId: req.body.orgId,
            categoryId: req.body.categoryId,
            statusId: 1
        })
            // project assign to user
            // const orgId = req.body.orgId;
            // const clientId = req.body.clientId;
            // const statusId = 1;
            // for (const uId of req.body.userId) {
            //     const develop = await ProjectAssign.findOne({
            //         where:
            //         {
            //             userId: uId
            //         }
            //     });
            //     if (!develop) {
            //         await ProjectAssign.create({
            //             proId: data.id,
            //             orgId: orgId,
            //             clientId: clientId,
            //             userId: uId,
            //             statusId: statusId
            //         });
            //     }
            // }
            //res.status(200).json({ success: 1, data: data, message: "Project created & assigned successfully" });
            .then(async (theData) => {
                const orgId = req.body.orgId;
                const clientId = req.body.clientId;
                const statusId = 1;
                if (theData) {
                    for (const uId of req.body.userId) {
                        await ProjectAssign.create({
                            proId: theData.id,
                            orgId: orgId,
                            clientId: clientId,
                            userId: uId,
                            statusId: statusId
                        }).then(async () => {
                            const userdetails = await ProjectAssign.findOne({
                                where: { id: uId }
                            })
                            // theData.dataValues.userName = userdetails.name
                            // console.log(theData);
                        })
                    }

                    res.status(200).json({ success: 1, data: theData, message: "Project created successfully" });
                }
            })
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// project assign user list:-
exports.proAssignUserList = async (req, res) => {
    try {
        const data = await ProjectAssign.findAll({
            attributes: [
                [Sequelize.col('"tbl_user"."id"'), "id"],
                [Sequelize.col('"tbl_user"."name"'), "name"],
            ],
            where: {
                proId: req.body.proId
            },
            include:
            {
                model: User, as: 'tblUsers', attributes: []
            }
        });
        // Extract user data into a flat array
        // const userData = data.map(assign => assign.tblUsers);
        res.status(200).json({ success: 1, data: data, message: "showing assigned user in project" })
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

//  project List 
exports.getProject = async (req, res) => {
    try {
        const showData = await ProjectAssign.findAll({
            attributes: ['userId',
                [Sequelize.col('"tblClient"."clientName"'), "clientName"],
                [Sequelize.col('"tblUser"."name"'), "name"],
                [Sequelize.col('"tblProject"."id"'), "id"],
                [Sequelize.col('"tblProject"."proName"'), "proName"],
                [Sequelize.col('"tblProject"."startDate"'), "startDate"],
                [Sequelize.col('"tblProject"."deadLine"'), "deadLine"],
            ],
            include: [
                {
                    model: Client,
                    as: "tblClient",
                    attributes: []
                },
                {
                    model: User,
                    as: "tblUser",
                    attributes: []
                },
                {
                    model: Project,
                    as: "tblProject",
                    attributes: []
                }
            ],
            where: ({ orgId: req.body.orgId })
        })
        res.status(200).json({ success: 1, data: showData });

    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// user drop down list according to org :-
exports.userDropDownList = async (req, res) => {
    try {
        const data = await User.findAll({
            attributes: ['id', 'name'],
            where: { orgId: req.body.orgId },
        })
        res.status(200).json({ success: 1, data: data });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}

// generate Report Api :- 
exports.upsertReport = async (req, res) => {
    try {
        const { employee_id, report } = req.body;

        const data = await Report.findOne({ where: ({ employee_id: employee_id }) })
        if (data) {
            await Report.update({ report: report })
            return res.status(200).json({ success: 1, message: 'Report updated successfully' })
        }
        else {
            data = await Report.create({ where: ({ employee_id: employee_id, report: report }) })
            return res.status(200).json({ success: 1, message: report, message: 'Report created successfully' });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// get report api :-
exports.getReport = async (req, res) => {
    try {
        const data = await Report.findAll({

        })
        res.status(200).json({ success: 1, data: data })
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }

}

// delete project :-
exports.deleteProject = async (req, res) => {
    try {
        const deletePro = await Project.destroy(
            {
                where: { id: req.body.id },
            });
        res.status(200).json({ success: 1, data: deletePro, message: "Project deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// update project :-
exports.updateProject = async (req, res) => {
    try {
        const data = await Project.update({
            proName: req.body.proName,
            proDesc: req.body.proDesc,
            startDate: req.body.startDate,
            deadLine: req.body.deadLine,
            deptId: req.body.deptId,
            proLead: req.body.proLead,
            clientId: req.body.proLead
        },
            {
                where: { id: req.body.id },
            })
        res.status(200).json({ success: 1, data: data, message: "Project updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message });
    }
}

// dashboard project api
exports.dashProApi = async (req, res) => {
    try {
        const data = await Project.findAndCountAll({

        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, messag: error.message });
    }
}

// pie chart of task 
exports.pieTask = async (req, res) => {
    try {
        const data = await TaskAssign.findAll({
            attributes: [
                [Sequelize.col('statusId'), 'statusId'],
                [Sequelize.col('"tblStatus"."statusName"'), "statusName"],
                [Sequelize.fn('COUNT', Sequelize.col('taskId')), 'taskCount']
            ],
            include: [
                {
                    model: Status,
                    as: "tblStatus",
                    attributes: []
                },
            ],
            where: { userId: req.body.userId },
            group: ['statusId', 'tblStatus.statusName'],
        })
        res.status(200).json({ success: 1, data: data });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: 0, message: error.message })
    }
}