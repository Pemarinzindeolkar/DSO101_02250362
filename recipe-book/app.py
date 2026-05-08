from flask import Flask, render_template, request, redirect, url_for, flash
import json
import os

app = Flask(__name__)
app.secret_key = "bhutanese_recipe_secret"

# File to store recipes
DATA_FILE = "recipes.json"

# Load existing recipes
def load_recipes():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

# Save recipes to file
def save_recipes(recipes):
    with open(DATA_FILE, "w") as f:
        json.dump(recipes, f, indent=2)

# Pre-populate with 3 authentic Bhutanese recipes if first time
def initialize_recipes():
    recipes = load_recipes()
    if len(recipes) == 0:
        default_recipes = [
            {
                "id": 1,
                "name": "Ema Datshi",
                "category": "Cheese Dish",
                "ingredients": "120g Fresh Green Chillies\n32g Spring Onions\n140g Farm Cheese\n25ml Vegetable Oil\n6g Salt\n40ml Water",
                "instructions": "1. Rinse the chillies, onion or spring onion. Cut the chillies in half lengthwise. Remove some seeds for less heat if desired. Chop spring onion into thin slices.\n2. Add all ingredients into a pot with quarter cup of water. Bring to a simmer, cover and cook over low heat until chillies are cooked.\n3. Add butter (optional) and cheese cubes by placing on top of other ingredients.\n4. Cover the pot and simmer until cheese has melted.\n5. Remove lid and stir until combined. Check salt.\n6. Serve hot with red rice.",
                "cooking_time": "6-10 minutes",
                "image_credit": "Bhutan eCookbook, Ministry of Energy and Natural Resources"
            },
            {
                "id": 2,
                "name": "Shamu Datshi",
                "category": "Cheese Dish",
                "ingredients": "85g Mushroom \n30g Fresh Green Chilli\n40g Cheese\n25ml Vegetable Oil\n5g Salt\n300ml Water",
                "instructions": "1. Rinse mushrooms and green chillies. Ensure water is completely squeezed from mushrooms.\n2. Cut mushrooms in half (big ones cut again into half). Cut green chillies into half lengthwise.\n3. Transfer all cut mushrooms, green chillies, water, oil and salt into a pot.\n4. Cover and cook on high heat until mushrooms are half cooked.\n5. Add cheese, cover again and cook until cheese begins to melt.\n6. Without mixing, turn off heat and let sit for 2-3 minutes.\n7. Finally mix well, check salt. Garnish with coriander leaves.",
                "cooking_time": "10-14 minutes",
                "image_credit": "Bhutan eCookbook, Ministry of Energy and Natural Resources"
            },
            {
                "id": 3,
                "name": "Phagsha Paa",
                "category": "Meat Dish",
                "ingredients": "290g Pork fillet (cut into strips)\n260g Onions\n270g Tomatoes\n250g Fresh Green Chillies\n1 tsp Chilli powder\n1/4 cup Vegetable Oil\n2 tsp Salt\n500ml Water",
                "instructions": "1. Wash pork fillet and cut into strips. Chop onion, tomatoes and green chillies into quarters.\n2. Add pork strips, onion, tomato, pinch of salt and water into pressure cooker.\n3. Cook under pressure until cooker whistles 10 times. Turn off heat and release pressure.\n4. Continue cooking with lid open and wet fry pork in its own oil until tender.\n5. Throw in garlic, green chillies and chilli powder (optional). Simmer over low heat until green chillies wilt.\n6. Add handful of coriander leaves on top. Serve with rice.",
                "cooking_time": "28-39 minutes",
                "image_credit": "Bhutan eCookbook, Ministry of Energy and Natural Resources"
            }
        ]
        save_recipes(default_recipes)

# Run initializer
initialize_recipes()

# Home page - show all recipes
@app.route("/")
def index():
    recipes = load_recipes()
    return render_template("index.html", recipes=recipes)

# View single recipe
@app.route("/recipe/<int:recipe_id>")
def view_recipe(recipe_id):
    recipes = load_recipes()
    recipe = None
    for r in recipes:
        if r["id"] == recipe_id:
            recipe = r
            break
    return render_template("recipe.html", recipe=recipe)

# Add new recipe form page
@app.route("/add")
def add_recipe_form():
    return render_template("add_recipe.html")

# Add new recipe submission
@app.route("/add", methods=["POST"])
def add_recipe():
    name = request.form.get("name")
    category = request.form.get("category")
    ingredients = request.form.get("ingredients")
    instructions = request.form.get("instructions")
    cooking_time = request.form.get("cooking_time")
    
    if name and ingredients and instructions:
        recipes = load_recipes()
        new_id = len(recipes) + 1
        new_recipe = {
            "id": new_id,
            "name": name,
            "category": category,
            "ingredients": ingredients,
            "instructions": instructions,
            "cooking_time": cooking_time,
            "image_credit": "User submitted"
        }
        recipes.append(new_recipe)
        save_recipes(recipes)
        flash(f"Recipe '{name}' added successfully!")
    else:
        flash("Please fill out all required fields.")
    return redirect(url_for("index"))

# Delete recipe
@app.route("/delete/<int:recipe_id>")
def delete_recipe(recipe_id):
    recipes = load_recipes()
    recipes = [r for r in recipes if r["id"] != recipe_id]
    # Re-number remaining recipes
    for i, recipe in enumerate(recipes, 1):
        recipe["id"] = i
    save_recipes(recipes)
    flash("Recipe deleted successfully!")
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)