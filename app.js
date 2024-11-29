const express=require("express");
const app=express();
let port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
// index route
app.get("/listings",async (req,res)=>{
            let allListings=await Listing.find({});
            res.render("listings/index.ejs",{allListings});
});
//New route
app.get("/listings/new",(req,res)=>{

  res.render("listings/new.ejs");
});
//book Route
app.get("/listings/:id/book",async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
    if(listing.isAvailable==false)
       {res.render("listings/book.ejs",{listing});}
    else{
      res.render("listings/reserved.ejs");
    }
    
});
//Status Route
app.get("/listings/status",async(req,res)=>{
  let allListings=await Listing.find({isAvailable:true});
  res.render("listings/status.ejs",{allListings});
}); 
//Show route
app.get("/listings/:id",async (req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id);
     res.render("listings/show.ejs",{listing});
});
//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
      let {id}=req.params;
     let listing=await Listing.findById(id);
      res.render("listings/edit.ejs",{listing});
});
//add new list
app.post("/listings",async (req,res)=>{
         let newListing=new Listing(req.body.listing);
        await  newListing.save();
         res.redirect("/listings");

});
// update  Route
app.put("/listings/:id",async (req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings");
});
//book 
app.post("/listings/:id",async(req,res)=>{
          let {id}=req.params;
          let listing=await Listing.findById(id);
          let dfr=req.body.daysforrent;
          let at=listing.price.slice(3,7)*dfr;
          let bb=req.body.bookedby;
          
   let newlisting=await Listing.findByIdAndUpdate(id,{isAvailable:true,bookedby:bb,amount:at,daysforrent:dfr},{new:true},{runValidators:true});
  
   res.redirect("/listings");
});
//terminate
  app.get("/listings/status/:id",async(req,res)=>{
        let {id}=req.params;
              await Listing.findByIdAndUpdate(id,{isAvailable:false,bookedby:"",amount:"",daysforrent:""},{new:true},{runValidators:true});
               res.redirect("/listings");
 
            });
//delete 
app.delete("/listings/:id",async(req,res)=>{
     let {id}=req.params;
         await Listing.findByIdAndDelete(id);
         res.redirect("/listings");
});

app.get("/",(req,res)=>{
    res.send("hello its working");
});
/*app.get("/testListing", async (req,res)=>{
    let samplelisting=new Listing({
        model:"Hyundai",
        desc:"Durable",
        category:"4 seater",

        price:" 1600"
    });
  await  samplelisting.save();
  console.log("sample was save");
  res.send("successful");
});*/




app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
});

 async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wheelsonrent");
  }
  main()
  .then(()=>{
    console.log("connection successful");
  })
  .catch((err)=>{
    console.log(err);
  })