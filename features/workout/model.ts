import * as yup from 'yup';

export type WorkoutType =  "upper body" | "chest & shoulders" | "lower body" 
| "legs" | "back" | "chest" | "shoulders" | "arms" | "chest and back" 
| "back and legs" | "abs" | "core" | "other";

export const AllowedWorkoutTypes = ["upper body", "chest & shoulders", "lower body" , 
"legs",  "back",  "chest", "shoulders", "arms", "chest and back", "back and legs", "abs",
"core",
"other"]

export type BodyPart =   "Back" |
"Biceps" |
"Chest" |
"Core" |
"Forearms" |
"Legs" |
"Shoulders" |
"Triceps" |
"Whole Body";

export const BodyPartsAllowedTypes = [
    "Back",
    "Biceps",
    "Chest",
    "Core",
    "Forearms",
    "Legs",
    "Shoulders",
    "Triceps",
    "Whole Body",
  ];



export type Units = "lbs" | "kgs";
export const AllowedUnits =["lbs", "kgs"];

export interface Lifter {
    userName: string,
    firstName?: string,
    lastName?: string,
    email: string,
    defaultUnits: Units,
    workouts: Workout[],
    bodyWeight? : number,
}

export const LifterSchema = yup.object().shape({
    userName: yup.string().min(5).max(20).required(),
    firstName: yup.string().min(1).max(30).notRequired(),
    lastName: yup.string().min(1).max(40).notRequired(),
    email: yup.string().email().min(6).max(80).required(),
    defaultUnits: yup.string().min(3).max(3).oneOf(AllowedUnits).required(),
    workouts: yup.array().of(yup.object()).min(0).max(20).required(),
    bodyWeight: yup.number().notRequired().min(20).max(2000),
});

export interface Workout {
    name: string,
    description?: string,
    defaultUnits: Units,
    workoutType: WorkoutType,
    exercises: Exercise[],
    time: string
}

export const WorkoutSchema = yup.object().shape({
    name: yup.string().min(3).max(80).required(),
    description: yup.string().min(5).notRequired(),
    defaultUnits: yup.string().min(3).max(3).oneOf(AllowedUnits).required(),
    workoutType: yup.string().oneOf(AllowedWorkoutTypes).required().default("other"),
    exercises: yup.array().of(yup.object()).min(0).max(30).required(),
    time: yup.string().default(() => new Date().toString()),

});


export interface Exercise {
    notes?: string, 
    routine: WorkoutRoutine,
    time: string,
    workingSets : WorkingSet[]
    units: Units
}

export const ExerciseSchema = yup.object().shape({
    routine: yup.object().required(),
    notes: yup.string().min(5).notRequired(),
    workingSets: yup.array().of(yup.object()).min(0).max(20).required(),
    time: yup.string().default(() => new Date().toString()),
    units: yup.string().min(3).max(3).oneOf(AllowedUnits).required(),
});

export interface WorkoutRoutine {
    name: string,
    slug: string,
    description?: string | null,
    bodyPart: BodyPart,
    type: string,
    category: string,
    aliases: string[],
}

export const WorkoutRoutineSchema = yup.object().shape({
    name: yup.string().min(3).max(80).required(),
    slug: yup.string().min(3).max(80).required(),
    description: yup.string().min(5).notRequired(),
    bodyPart: yup.string().oneOf(BodyPartsAllowedTypes).required(),
    type: yup.string().min(3).max(80).required(),
    category: yup.string().min(3).max(80).required(),
    aliases: yup.array().of(yup.object()).min(0).max(20).required(),
});

export interface WorkingSet {
    reps: number,
    weight: number
}

export const WorkingSetSchema = yup.object().shape({
    reps: yup.number().required().min(1).max(1000),
    weight: yup.number().required().min(0.1).max(10000)
});








