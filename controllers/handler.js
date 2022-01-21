const datapath = require("../useraccount.json");
const fs = require("fs");
const e = require("express");

//add header
exports.addHeaderData = (req, res) => {
  var data = req.body;
  var Data = getData();
  Data[0].headerData.push(req.body);
  console.log("header", Data);
  saveData(Data);
  res.send({ success: true, msg: "Column added successfully" });
};
//delete header
exports.removeHeader = (req, res) => {
  var header_id = req.params.id;

  if (header_id == "taskID") {
    res.status(400).send("Oh uh, This column can't be deleted.");
  } else {
    var Data = getData();
    if (Data && Data.length > 0) {
      var headerData = Data[0].headerData;
    }
    if (headerData && headerData.length > 0) {
      let index = headerData.findIndex((obj) => obj.id == header_id);
      console.log("index", index);
      if (index == -1) {
        res.send({ success: true, msg: "No coulmn exist" });
      } else {
        headerData.splice(index, 1);
        saveData(Data);
        res.send({ success: true, msg: "Column removed successfully" });
      }
    } else {
      res.send({ success: true, msg: "No header exist" });
    }
  }
};

//get all headers
exports.getHeaders = (req, res) => {
  var Data = getData();
  if (Data && Data.length > 0) {
    var headerData = Data[0].headerData;
  }
  if (headerData && headerData.length > 0) {
    var headerData = Data[0].headerData;
    res.send({ success: true, data: headerData });
  } else {
    res.send({ success: true, data: "No header found" });
  }
};

//get header data
exports.getHeaderData = (req, res) => {
  var header_id = req.params.id;
  var Data = getData();
  if (Data && Data.length > 0) {
    var headerData = Data[0].headerData;
  }
  if (headerData && headerData.length > 0) {
    let column = headerData.find((obj) => obj.id == header_id);
    console.log("column", column);
    if (column == undefined) {
      res.send({ success: true, msg: "No coulmn exist" });
    } else {
      res.send({ success: true, data: column });
    }
  } else {
    res.send({ success: true, msg: "No header exist" });
  }
};

//get header data
exports.editHeaderData = (req, res) => {
  var header_id = req.params.id;
  var Data = getData();
  if (Data && Data.length > 0) {
    var headerData = Data[0].headerData;
    if (headerData && headerData.length > 0) {
      var column = headerData.find((obj) => obj.id == header_id);
      if (column == undefined) {
        res.send({ success: true, msg: "No coulmn exist" });
      } else {
        if (
          req.body.hasOwnProperty("metadata") &&
          req.body.hasOwnProperty("columnName")
        ) {
          if (req.body.hasOwnProperty("columnName")) {
            const newReqObj = req.body;
            const keys = Object.keys(newReqObj);
            keys.forEach((key, index) => {
              column[key] = newReqObj[key];
            });
            saveData(Data);
          }

          if (req.body.hasOwnProperty("metadata")) {
            let existingObj = column;
            let savedMataData = column.metadata;
            for (let properties in req.body.metadata) {
              var result = savedMataData.hasOwnProperty(properties);
              if (result) {
                const newReqObj = req.body.metadata;
                savedMataData[`${properties}`] =
                  req.body.metadata[`${properties}`];
                saveData(Data);
              }
            }
          }
          res.send({ success: true, msg: "Header updated successfully" });
        } else if (req.body.hasOwnProperty("metadata")) {
          let existingObj = column;
          let savedMataData = column.metadata;
          for (let properties in req.body.metadata) {
            var result = savedMataData.hasOwnProperty(properties);
            if (result) {
              const newReqObj = req.body.metadata;
              savedMataData[`${properties}`] =
                req.body.metadata[`${properties}`];
              saveData(Data);
            }
          }
          res.send({ success: true, msg: "Header updated successfully" });
        } else {
          console.log("33");
          const newReqObj = req.body;
          const keys = Object.keys(newReqObj);
          keys.forEach((key, index) => {
            column[key] = newReqObj[key];
          });
          saveData(Data);
          res.send({ success: true, msg: "Header updated successfully" });
        }
      }
    } else {
      res.send({ success: true, msg: "No header exist" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//create task
exports.createTask = (req, res) => {
  var existAccounts = getData();
  var rowsData = existAccounts[0].rowsData;
  var lastId = 0;
  var subtasks = [];
  var newObj = {};
  if (existAccounts && existAccounts.length > 0) {
    var rowsData = existAccounts[0].rowsData;
  }
  if (rowsData && rowsData.length > 0) {
    var lastaccount = rowsData[rowsData.length - 1];
    if (
      lastaccount &&
      lastaccount.subtasks &&
      lastaccount.subtasks.length > 0
    ) {
      var lastsubtask = lastaccount.subtasks[lastaccount.subtasks.length - 1];
      lastId = lastsubtask["taskID"];
    } else {
      lastId = lastaccount["taskID"];
    }
    newObj = Object.assign({ taskID: ++lastId }, req.body);
    newObj["subtasks"] = subtasks;
  } else {
    newObj = Object.assign({ taskID: 1 }, req.body);
    newObj["subtasks"] = subtasks;
  }
  existAccounts[0].rowsData.push(newObj);
  saveData(existAccounts);
  res.send({ success: true, msg: "task added successfully" });
};

//get tasks
exports.getTasks = (req, res) => {
  const Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      res.send({ success: true, data: rowsData });
    } else {
      res.send({ success: true, msg: "No task exist" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//get particular task
exports.getTask = (req, res) => {
  const taskId = req.params["id"];
  const Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == taskId);
      if (task == undefined) {
        res.send({ success: true, msg: "No task exist" });
      } else {
        res.send({ success: true, task: task });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//delete task
exports.deleteTask = (req, res) => {
  const task_id = req.params["id"];

  const Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let index = rowsData.findIndex((obj) => obj["taskID"] == task_id);
      console.log(index);
      if (index != -1) {
        rowsData.splice(index, 1);
        saveData(Data);
        resuffling(Data, rowsData);
        res.send({ success: true, msg: "Task removed successfully" });
      } else {
        res.send({ success: true, msg: "No task found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//update task
exports.updateTask = (req, res) => {
  const taskId = req.params["id"];
  var Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == taskId);
      console.log(task);
      if (task != undefined) {
        let existingObj = task;
        const newReqObj = req.body;
        const keys = Object.keys(newReqObj);
        keys.forEach((key, index) => {
          existingObj[key] = newReqObj[key];
        });
        saveData(Data);
        res.send({ success: true, msg: "Task updated successfully" });
      } else {
        res.send({ success: true, msg: "No task found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//delete subtasktaskProperty
exports.deleteTaskProperty = (req, res) => {
  const task_id = req.params["id"];
  const propertyName = req.params["propertyName"];
  var Data = getData();
  var defaultValue;
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    var headerData = Data[0].headerData;
    if (headerData && headerData.length > 0) {
      for (let obj of headerData) {
        console.log("obj", obj.columnName);
        var coulmnId = headerData.find((obj) => obj.columnName == propertyName);
        console.log("coulmnId", coulmnId);
        console.log("defaultValue", coulmnId.metadata.defaultValue);
        defaultValue = coulmnId.metadata.defaultValue;
      }
    }

    if (rowsData && rowsData.length > 0) {
      let index = rowsData.findIndex((obj) => obj["taskID"] == task_id);
      console.log(index);
      if (index != -1) {
        rowsData[index][propertyName] = defaultValue;
        saveData(Data);
        res.send({ success: true, msg: "Task property removed successfully" });
      } else {
        res.send({ success: true, msg: "No task found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//create sub task
exports.createSubTask = (req, res) => {
  var existAccounts = getData();
  var task_id = req.params["taskid"];
  var newObj = {};
  var lastId;
  if (existAccounts && existAccounts.length > 0) {
    var rowsData = existAccounts[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == task_id);
      if (task == undefined) {
        res.send({ success: true, msg: "No task found with this id" });
      } else {
        if (task.subtasks && task.subtasks.length > 0) {
          var total_subtasks = task.subtasks;
          var lastsubtask = task.subtasks[task.subtasks.length - 1];
          lastId = lastsubtask["taskID"];
          newObj = Object.assign({ taskID: lastId }, req.body);
        } else {
          newObj = Object.assign({ taskID: ++task_id }, req.body);
        }
        task.subtasks.push(newObj);
        saveData(existAccounts);
        resuffling(existAccounts, rowsData);
        res.send({ success: true, msg: "subtask added successfully" });
      }
    } else {
      res.send({ success: true, msg: "No task exist" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//update task
exports.updateSubTask = (req, res) => {
  const taskId = req.params["taskid"];
  const subtask_id = req.params["subtaskid"];
  var Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == taskId);
      let subtasks = task.subtasks;
      let sub_task = subtasks.find((obj) => obj["taskID"] == subtask_id);
      console.log("sub_task", sub_task);
      if (sub_task != undefined) {
        let existingObj = sub_task;
        const newReqObj = req.body;
        const keys = Object.keys(newReqObj);
        keys.forEach((key, index) => {
          existingObj[key] = newReqObj[key];
        });
        saveData(Data);
        res.send({ success: true, msg: "Subtask updated successfully" });
      } else {
        res.send({ success: true, msg: "No subtask found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};
//delete subtasktask
exports.deleteSubTask = (req, res) => {
  const subtask_id = req.params["subtaskid"];
  const task_id = req.params["taskid"];
  const Data = getData();
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == task_id);
      if (task && task.subtasks) {
        let subtasks = task.subtasks;
        let index = subtasks.findIndex((obj) => obj["taskID"] == subtask_id);
        if (index != -1) {
          console.log("index", index);
          subtasks.splice(index, 1);
          saveData(Data);
          resuffling(Data, rowsData);
          res.send({ success: true, msg: "Subtask removed successfully" });
        } else {
          res.send({ success: true, msg: "No task found with this id" });
        }
      } else {
        res.send({ success: true, msg: "No task found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
};

//delete suntasktaskProperty
exports.deleteSubTaskProperty = (req, res) => {
  const task_id = req.params["taskid"];
  const subtask_id = req.params["subtaskid"];
  const propertyName = req.params["propertyName"];
  const Data = getData();
  var defaultValue;
  if (Data && Data.length > 0) {
    var rowsData = Data[0].rowsData;
    var headerData = Data[0].headerData;
    if (headerData && headerData.length > 0) {
      for (let obj of headerData) {
        console.log("obj", obj.columnName);
        var coulmnId = headerData.find((obj) => obj.columnName == propertyName);
        console.log("coulmnId", coulmnId);
        console.log("defaultValue", coulmnId.metadata.defaultValue);
        defaultValue = coulmnId.metadata.defaultValue;
      }
    }
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == task_id);
      let subtasks = task.subtasks;
      let index = subtasks.findIndex((obj) => obj["taskID"] == subtask_id);
      console.log("index", index);
      if (index != -1) {
        subtasks[index][propertyName] = defaultValue;
        saveData(Data);
        res.send({
          success: true,
          msg: "Subtask property removed successfully",
        });
      } else {
        res.send({ success: true, msg: "No subtask found with this id" });
      }
    } else {
      res.send({ success: true, msg: "No data found" });
    }
  } else {
    res.send({ success: true, msg: "No data found" });
  }
  existAccounts.find((obj) => obj["taskID"] == task_id);
  let task = existAccounts.find((obj) => obj["taskID"] == task_id);
  let subtasks = task.subtasks;
  let index = subtasks.findIndex((obj) => obj["taskID"] == subtask_id);
  delete subtasks[index][propertyName];
  saveUserData(existAccounts);
  res.send({ success: true, msg: "Subtask property removed successfully" });
};

//create task property
exports.addProperty = (req, res) => {
  fs.readFile("useraccount.json", "utf8", (err, data) => {
    const task_id = req.params["id"];
    var existAccounts = getData();
    if (existAccounts && existAccounts.length > 0) {
      var rowsData = existAccounts[0].rowsData;
    }
    if (rowsData && rowsData.length > 0) {
      let task = rowsData.find((obj) => obj["taskID"] == task_id);
      let existingObj = task;
      const newReqObj = req.body;
      const keys = Object.keys(newReqObj);
      keys.forEach((key, index) => {
        existingObj[key] = newReqObj[key];
      });
      saveData(existAccounts);
      res.send({ success: true, msg: "Property added successfully" });
    } else {
      res.send({ success: true, msg: "No task exist" });
    }
  });
};
//create subtasktask property
exports.addSubtaskProperty = (req, res) => {
  var existAccounts = getUserData();
  fs.readFile("useraccount.json", "utf8", (err, data) => {
    const taskId = req.params["taskid"];
    const subtask_id = req.params["subtaskid"];
    let task = existAccounts.find((obj) => obj["taskID"] == taskId);
    let subtasks = task.subtasks;
    let sub_task = subtasks.find((obj) => obj["taskID"] == subtask_id);
    let existingObj = sub_task;
    const newReqObj = req.body;
    const keys = Object.keys(newReqObj);
    keys.forEach((key, index) => {
      existingObj[key] = newReqObj[key];
    });
    saveUserData(existAccounts);
    res.send({ success: true, msg: "Subtask updated successfully" });
  });
};

function resuffling(existAccounts, rowsData) {
  var count = 1;
  for (let i = 0; i < rowsData.length; i++) {
    rowsData[i]["taskID"] = count++;
    console.log("count", count);
    for (let j = 0; j < rowsData[i].subtasks.length; j++) {
      rowsData[i].subtasks[j]["taskID"] = count++;
    }
  }
  saveData(existAccounts);
}
//get all data from json file
const getData = () => {
  const jsonData = fs.readFileSync("rowsdata.json");
  return JSON.parse(jsonData);
};
// save data into json file
const saveData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("rowsdata.json", stringifyData);
};
