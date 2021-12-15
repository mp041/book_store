const Category = require('../models/categoryModel');

const categoryCtrl =  {
    getCategories : async (req,res) => {
      try{
        const categories = await Category.find()
        res.json(categories);


      }catch(err){
        return res.status(500).json({message: err.message});
      }
    },

    createCategory : async (req,res) => {
      try{
        const {name} = req.body;
        const category = await Category.findOne({name});

        if(category) return res.status(400).json({message: "this category already exists"})

        const newCategory = new Category({name});

        await newCategory.save()
        res.json({message: "Created category"})
      }catch(err){
        return res.status(500).json({message: err.message});
      }
    },
    deleteCategory : async (req,res) => {
      try{
        await Category.findByIdAndDelete(req.params.id)

        res.json({message: "Deleted Category"});
      }catch(err){
        return res.status(500).json({message: err.message});

      }
    },
    updateCategory : async (req,res) => {
      try {
        const {name} = req.body;
        await Category.findByIdAndUpdate({_id : req.params.id},{name})

        res.json({message: "Category updated"});

      }catch(err){
        return res.status(500).json({message: err.message});

      }
    }
}


module.exports = categoryCtrl;
