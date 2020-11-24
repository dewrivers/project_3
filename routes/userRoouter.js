const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/userModel');

// route to register a new user
router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;

    //validate 
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });

       // password minimun length validation
       if (password.length < 5)
       return res
         .status(400)
         .json({ msg: "The password needs to be at least 5 characters long." });

       //password validation
       if (password !== passwordCheck)
       return res
         .status(400)
         .json({ msg: "Enter the same password twice for verification." });

      // unique email validation
      const existingUser = await User.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
  
      if (!displayName) displayName = email;
  
    //we are hashing for the sequirity of the passwords
    const salt = await bcrypt.genSalt();
    // This will return compleat gbrige password
    const passwordHash = await bcrypt.hash(password, salt);

    //console.log(passwordHash);
    
    // creating a new user
    const newUser = new User({
        email,
        password: passwordHash,
        displayName,
      });

    // saving the new user
    const savedUser = await newUser.save();
    res.json(savedUser);
  } 
    catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//route to login an exists user
router.post("/login", async (req, res) => {
    try {
        const{ email, password } = req.body;

        // validate 
           if (!email || !password)
            return res
           .status(400)
           .json({ msg: "Not all fields have been entered." });

        // finding the user that matches the email
        const user = await User.findOne({ email: email });
        if(!user)
           return res
           .status(400)
           .json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
           return res
            .status(400)
            .json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
            },
        });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});
// route to delete user
router.delete('/delete', auth, async (req, res) => {
   // console.log(req.user);

   try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
    } 
    catch (err) {
    res.status(500).json({ error: err.message });
    }

});
// route to check if the user is valid
router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ 
        displayName: user.displayName,
        id: user._id,
    });
});


module.exports = router;