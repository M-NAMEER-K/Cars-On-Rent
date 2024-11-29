const mongoose=require("mongoose");
const listingSchema=mongoose.Schema({
       model:{
        type:String,
    required:true},
    image:{
        default:"https://www.shutterstock.com/image-vector/flat-front-simple-car-icon-600nw-2136723397.jpg",
        type:String,
        set:(v)=>v===""?"https://www.shutterstock.com/image-vector/flat-front-simple-car-icon-600nw-2136723397.jpg":v
    },
       desc:String,
       category:String,
       price:String,
       isAvailable:Boolean,
       bookedby:String,
       daysforrent:String,
       amount:String
});
const Listing =mongoose.model("Listing",listingSchema);
     module.exports=Listing;