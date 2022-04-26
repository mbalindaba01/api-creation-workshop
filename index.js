// add code in here to create an API with ExpressJS
const express = require('express')
const { verify } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
const garments = require('./garments.json')
const app = express()
require("dotenv").config();
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/api/garments', verifyToken, (req, res) => {
    const gender = req.query.gender
    const season = req.query.season

    const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender 
				&& garment.season === season
		} else if(gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if(season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true
	})
    res.json({
        garments: filteredGarments
    })
})


app.post('/api/garments', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err){
      res.sendStatus(403)
    }else {
      const {
        description,
        img,
        gender,
        season,
        price
      } = req.body;
    
      if (!description || !img || !price) {
        res.json({
          status: 'error',
          message: 'Required data not supplied',
          authData
        });
      } else {
        garments.push({
          description,
          img,
          gender,
          season,
          price
        });
    
        res.json({
          status: 'success',
          message: 'New garment added.',
          authData
        });
      }
    }
  })
});


app.get('/api/garments/price/:price', verifyToken, (req, res) => {
    const maxPrice = Number(req.params.price)
	const filteredGarments = garments.filter(garment => {
		if (maxPrice > 0) {
			return garment.price <= maxPrice
		}
		return true
	})

	res.json({ 
		garments : filteredGarments
	})
})

const generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '24h',
  });
}

app.post('/auth', (req, res) => {
  const username = req.query.username
    if(username == 'mbalindaba01'){
      console.log('works!')
      const user = {username: 'mbalindaba01'}
      const accessToken = generateToken(user)
      res.json({accessToken: accessToken})
     }else{
       throw new Error('Access Denied')
     }
})

function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const token = bearerHeader.split(' ')[1]
    req.token = token
    next()
  }else {
    res.sendStatus(403)
  }
}

const PORT = process.env.PORT || 4017

app.listen(PORT, () => console.log('App started on port ' + PORT))

