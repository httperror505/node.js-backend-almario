const express = require('express');
const db = require('../config/database');

const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');

router.post('/RoleRegister',authenticateToken, async (req, res) =>{

    try {

        const {role_name} = req.body;
        const insertUserQuery = 'INSERT INTO roles (role_name) VALUES (?)';
        await db.promise().execute(insertUserQuery,[role_name]);

        res.status(201).json({ message: 'Role registered succesfully'});
    } catch (error) {

        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Role is already used'});
    }



    });
    

    router.get('/roles',authenticateToken,  (req, res) => {

        try {
    
            db.query('SELECT role_id,role_name FROM roles', (err , result)=> {
                
                if(err){
                    console.error('Error fetching items:', err);
                }else{
                    res.status(200).json(result);
                }
            });
        } catch(error){
    
            console.error('Error loading users:', error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    });
    

    router.get('/roleget1/:id', authenticateToken, (req, res)=> {
        let role_id =req.params.id;
        if(!role_id){
            return res.status(400).send({ error: true, messgae: 'Please provide user_id'});
        }
    
        try{
    
            db.query('SELECT role_id,role_name FROM roles WHERE role_id = ?', role_id, (err, result)=>{
    
                if(err){
                    console.error('Error fetcing items:', err);
                    res.status(500).json({message: 'Internal Server Error'});
                }else{
                    res.status(200).json(result);
                }
            });
        }catch (error){
            console.error('Error loading user:', error);
            res.status(200).json({ error: 'Internal Server Error'});
        }
    });

    
//UPDATE USER
router.put('/roleupdate/:id', authenticateToken,async(req, res)=>{

    let role_id =req.params.id;

    const {role_name} = req.body;

    if(!role_id || !role_name ){
        return res.status(400).send({ error: role , message: 'Please provide  role_code, role_name'});
    }

    try{
        db.query('UPDATE roles SET  role_name =?  WHERE role_id =?', [role_name, role_id],(err, result, field) =>{

          if(err){
            console.error('Error updating items:', err);
            res.status(500).json({ message: 'Internal Server Error'});
          } else{
            res.status(200).json(result);
          } 
        } );
    
    } catch(error){
        console.error('Error Loading User', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});


router.delete('/deleterole/:id',authenticateToken, (req, res) => {
    let role_id = req.params.id;

    if( !role_id){
        return res.status(400).send({ error: true , message: 'Please provide role_id'});
    }

    try {

        db.query('DELETE FROM roles WHERE role_id =?', role_id,(err, result, field)=>{
            if (err){
                console.error('Error Deleting item:');
                res.status(500).json({ message: 'Internal Server Error'});
            } else{
                res.status(200).json(result);
            }
        });
    }catch(error){
        console.error('Error loading users:',error);
        res.status(500).json({error: 'Internal Server Error'});
    }

   
});


module.exports = router;