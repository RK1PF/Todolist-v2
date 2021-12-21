//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { redirect } = require("express/lib/response");
const date = require(__dirname + "/date.js");
const app = express();

async function main() {
  await mongoose.connect("mongodb://localhost:27017/todolist");

  await routing();

}
// MONGOOSE
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Item = new mongoose.model("Item", itemSchema);

//MONGOOSE END

// ROUTING 
function routing() {
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.get("/", function (req, res) {
    const day = date.getDate();
    Item.find((err, items) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        items.forEach(e => {
          console.log(`\n${e.name}`);
        });
      }
      res.render("list", { listTitle: day, newListItems: items });
    })
  });
  // Submit du formulaire
  app.post("/", function (req, res) {

    const item = req.body.newItem;

    if (req.body.list === "Work") {
      workItems.push(item);
      res.redirect("/work");
    } else {
      // items.push(item);
      const itemPush = new Item({
        name: item
      })
      itemPush.save().then(() => console.log(`${itemPush.name}. Inserted`));
      res.redirect("/");
    }
  });
  //Delete item
  app.post("/delete",(req,res)=>{
    // trim() is important to delete extra spaces
    const checkedItem = req.body.checkbox.trim();
    
    Item.findByIdAndRemove(checkedItem, (err)=>{
      if(err){
        console.log(err);
      } else {
        console.log(`Supression de l'item portant l'id ${checkedItem}`);
        res.redirect("/");
      }
    })
  }) 
  app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });
}
// ROUTING END
app.listen(987, function () {
  console.log("Server started on http://localhost:987");
});

main().catch(err => console.log(err));