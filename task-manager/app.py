from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__)

# File to store tasks
DATA_FILE = "tasks.json"

# Load existing tasks
def load_tasks():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

# Save tasks to file
def save_tasks(tasks):
    with open(DATA_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

# Home page - show all tasks
@app.route("/")
def index():
    tasks = load_tasks()
    return render_template("index.html", tasks=tasks)

# Add a new task
@app.route("/add", methods=["POST"])
def add_task():
    task_title = request.form.get("title")
    if task_title:
        tasks = load_tasks()
        new_task = {
            "id": len(tasks) + 1,
            "title": task_title,
            "completed": False
        }
        tasks.append(new_task)
        save_tasks(tasks)
    return redirect(url_for("index"))

# Mark task as complete/incomplete
@app.route("/toggle/<int:task_id>")
def toggle_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            break
    save_tasks(tasks)
    return redirect(url_for("index"))

# Delete a task
@app.route("/delete/<int:task_id>")
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task["id"] != task_id]
    # Re-number remaining tasks
    for i, task in enumerate(tasks, 1):
        task["id"] = i
    save_tasks(tasks)
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)