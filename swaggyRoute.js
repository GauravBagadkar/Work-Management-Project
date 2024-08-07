/**
 * @swagger
 * /api/auth/delete_drawing:
 *  post:
 *    tags:
 *        - Drawing
 *    description: Delete a Drawing
 *    parameters:
 *      - name: Delete-Drawing
 *        decription: request body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            current_user_id:
 *              type: integer
 *            company_id:
 *              type: integer
 *            project_id:
 *              type: integer
 *            drawing_id:
 *              type: integer
 *          required:
 *            - current_user_id
 *            - company_id
 *            - project_id
 *            - drawing_id
 *    responses:
 *      '200':
 *        description: Drawing Deleted Successfully .
 */


/**
 * @swagger
 * /deptList:
 *   get:
 *     summary: Get department list
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 */

/**
 * @swagger
 * /roleList:
 *   get:
 *     summary: Get role list
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 */

/**
 * @swagger
 * /priorityList:
 *   get:
 *     summary: Get task priority list
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of task priorities
 */

/**
 * @swagger
 * /statusList:
 *   get:
 *     summary: Get task status list
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of task statuses
 */

/**
 * @swagger
 * /clientList:
 *   get:
 *     summary: Get client list
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients
 */

/**
 * @swagger
 * /showEmpDetails:
 *   get:
 *     summary: Show employee details
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Employee details
 */

/**
 * @swagger
 * /orgApi:
 *   post:
 *     tags:
 *       - Organization
 *     description: Organization registration
 *     parameters:
 *       - in: body
 *         name: organization registraion
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string                     
 *             address:
 *               type: string
 *             contact:
 *               type: integer
 *             password:
 *               type: string
 *         required:
 *           - name
 *           - email
 *           - address
 *           - contact
 *           - password
 *     responses:
 *       200:
 *         description: Organization registered successfully
 */

/**
 * @swagger
 * /registerUserApi:
 *   post:
 *     tags:
 *         - Users Register
 *   description: Creating a user registration
 *   parameters:
 *    - in: body
 *      name: User Registration     
 *      schema:  
 *          type: object
 *      properties:
 *         name:
 *          type: string
 *         email:
 *          type: string
 *         password:
 *          type: string
 *         gender:
 *          type: string   
 *         address:
 *          type: string
 *         contact:
 *          type: integer
 *         dob:
 *          type: date
 *         joinDate:
 *          type: date
 *         roleId:
 *          type: integer
 *         deptId:
 *          type: integer
 *         orgId:
 *          type: integer
 *      required:
 *        - name
 *        - email
 *        - password
 *        - gender
 *        - address
 *        - contact
 *        - dob
 *        - joinDate
 *        - roleId
 *        - deptId
 *        - orgId
 *     responses:
 *       200:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /userLogin:
 *   post:
 *     tags:
 *       - User
 *     description: User login
 *     parameters:
 *       - in: body
 *         name: credentials
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - email
 *           - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 */

/**
 * @swagger
 * /updateUserApi:
 *   post:
 *     tags:
 *       - User
 *     description: Update user details
 *     parameters:
 *       - in: body
 *         name: user
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             gender:
 *               type: string
 *             address:
 *               type: string
 *             contact:
 *               type: integer
 *             dob:
 *               type: string
 *               format: date
 *             joinDate:
 *               type: string
 *               format: date
 *             roleId:
 *               type: integer
 *             deptId:
 *               type: integer
 *             orgId:
 *               type: integer
 *         required:
 *           - userId
 *     responses:
 *       200:
 *         description: User details updated successfully
 */


