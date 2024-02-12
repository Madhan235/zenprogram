import client from "./index";

// Find all the topics and tasks which are thought in the month of October

export async function getTopicsAndTasksInOct(from, to) {
  try {
    const topicsOct = await client
      .db("zenClass")
      .collection("topics")
      .find({ topic_date: { $gte: new Date(from), $lte: new Date(to) } })
      .toArray();

    const tasksOct = await client
      .db("zenClass")
      .collection("tasks")
      .find({ tasks_date: { $gte: new Date(from), $lte: new Date(to) } })
      .toArray();

    return { topicsOct, tasksOct };
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

getTopicsAndTasksInOct("2020-10-01", "2020-10-31");

// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

export async function companyAppearedBetween(from, to) {
  try {
    return await client
      .db("zenClass")
      .collection("company_drives")
      .find({ appeared_date: { $gte: new Date(from), $lte: new Date(to) } })
      .toArray();
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

companyAppearedBetween("2020-10-15", "2020-10-31");

// Find all the company drives and students who are appeared for the placement.

export async function companyDrivesAndStudentsAppearedForPlac() {
  try {
    const allCompanyDrives = await client
      .db("zenClass")
      .collection("company_drives")
      .find({ appeared: true })
      .toArray();

    const allStudentsAppeared = await client
      .db("zenClass")
      .collection("users")
      .find({ appeared: true })
      .toArray();

    return { allCompanyDrives, allStudentsAppeared };
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

// Find the number of problems solved by the user in codekata

// for induvial users

export async function NoOfPrbmsSlvdByUserInCodeKata(id) {
  try {
    const userDetails = await client
      .db("zenClass")
      .collection("users")
      .find({ _id: new ObjectId(id) });

    return userDetails ? userDetails.problem_solved || 0 : "user not found";
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

// for all users

export async function NoOfPrbmsSlvdByAllUsersInCodeKata() {
  try {
    const users = await client
      .db("zenClass")
      .collection("users")
      .find()
      .toArray();
    let totalProblemsSolved = 0;
    users.forEach((user) => {
      totalProblemsSolved += user.problems_solved || 0;
    });
    return totalProblemsSolved;
  } catch (error) {
    console.log("Error in fetching data from DB:", error);
  }
}

// Find all the mentors with who has the mentee's count more than 15

export async function findMenteesCount() {
  try {
    return await client
      .db("zenClass")
      .collection("mentors")
      .find({ "mentee's count": { $gt: 15 } })
      .toArray();
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

export async function NoOfStdsAbsentAndTaskNotSubmitedBetween(from, to) {
  try {
    return await client
      .db("zenClass")
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "attendence",
            localfield: "_id",
            forgeinfield: "user_id",
            as: "attendance",
          },
        },
        {
          $lookup: {
            from: "tasks",
            localfield: "_id",
            forgeinfield: "user_id",
            as: "tasks",
          },
        },

        {
          $match: {
            $or: [
              {
                $and: [
                  {
                    "attendance.attendance_date": {
                      $gte: new Date(from),
                      $lte: new Date(to),
                    },
                  },
                  { "attendence.is_present": false },
                ],
              },
              {
                $and: [
                  {
                    "tasks.task_submission_date": {
                      $gte: new Date(from),
                      $lte: new Date(to),
                    },
                  },
                  { "tasks.task_submission_date": { $exists: false } },
                ],
              },
            ],
          },
        },
        { $count: "users_count" },
      ]);
  } catch (error) {
    console.log("Error in fetching Data fron Db", error);
  }
}

NoOfStdsAbsentAndTaskNotSubmitedBetween("2020-10-15", "2020-10-31");
