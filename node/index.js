const express=require('express');
const uploadRouter=require('./Router/EcelRouter');

const app=express();
app.use(express.json());

app.use('/upload', uploadRouter);

const port=3000;

app.get('/',(req,res)=>{
    res.send('Hello World');
});


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})