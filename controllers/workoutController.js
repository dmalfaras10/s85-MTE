const Workout = require('../models/Workout.js');
const { errorHandler } = require("../auth.js");

module.exports.addWorkout = (req, res) => {
  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Authentication required. Please log in."
    });
  } else if (!req.body.name || !req.body.duration) {
    return res.status(400).send({
      success: false,
      message: "Workout name and duration are required."
    });
  } else {
    let newWorkout = new Workout({
      name: req.body.name,
      userId: req.user.id,
      duration: req.body.duration,
      status: req.body.status
    });

    return newWorkout.save()
      .then(workout => res.status(201).send({
        success: true,
        message: "Workout added successfully",
        workout
      }))
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.getMyWorkouts = (req, res) => {
  return Workout.find({ userId: req.user.id })
    .then(workouts => {
      if (workouts.length > 0) {
        return res.status(200).send({
          success: true,
          workouts
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "No workouts found for this user."
        });
      }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
  let workoutId = req.params.workoutId.replace(/^"+|"+$/g, "").trim();

  if (!workoutId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing workout ID."
    });
  } else {
    let updatedWorkout = {
      name: req.body.name,
      duration: req.body.duration,
      status: req.body.status
    };

    return Workout.findByIdAndUpdate(workoutId, updatedWorkout, { returnDocument: 'after', runValidators: true })
      .then(workout => {
        if (workout) {
          return res.status(200).send({
            success: true,
            message: "Workout updated successfully",
            updatedWorkout: workout
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Workout not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.deleteWorkout = (req, res) => {
  let workoutId = req.params.workoutId.replace(/^"+|"+$/g, "").trim();

  if (!workoutId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing workout ID."
    });
  } else {
    return Workout.findByIdAndDelete(workoutId)
      .then(workout => {
        if (workout) {
          return res.status(200).send({
            success: true,
            message: "Workout deleted successfully"
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Workout not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.completeWorkoutStatus = (req, res) => {
  let workoutId = req.params.workoutId.replace(/^"+|"+$/g, "").trim();

  if (!workoutId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing workout ID."
    });
  } else {
    return Workout.findByIdAndUpdate(
      workoutId,
      { status: "completed" },
      { returnDocument: 'after', runValidators: true }
    )
      .then(workout => {
        if (workout) {
          return res.status(200).send({
            success: true,
            message: "Workout status marked as completed",
            updatedWorkout: workout
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Workout not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};