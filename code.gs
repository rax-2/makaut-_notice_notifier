function htmlTemplateMake(dataFormat = "") {
  let year = getIndiaDateArray()
  let htmlMailTemplate = `
  <div style="padding: 10px; border-radius: 10px;">
        <div style="background-color: #e5ffa9; padding: 10px; border-radius: 10px;">

            <div
                style="display: flex; align-items: baseline; width: 100%; background-color: #3498db; border-radius: 4px 100px 100px 4px; padding: 4px;">
                <h1>
                    📢 MAKAUT Notice Notification
                </h1>
                <p style="padding: 4px; font-size: 10px; color: white; font-weight: bolder;">
                    Powered by YantraYodha ECE
                </p>
            </div>
            <div style="margin-top: 4px; margin-bottom:26px; ">
                <div>
                    <h3>
                        Latest Announcement From MAKAUT
                    </h3>
                </div>
                <hr style="background-color:#348a3a; height: 8px; width: 90%; border-radius: 0px 100px 100px 0px;">
                <div id="noticePanel" style="padding: 20px; background-color: #ffffff00;">
                    <div style="width: 100%;" id="notice_showw">
                        ${dataFormat}
                    </div>
                </div>
            </div>
            <div
                style="margin: 0; border-radius: 10px; padding: 15px; padding-bottom: 10px; background-color: #8caa41; ">


                <div style="color: white; width: 100%; ">
                    <h2 style="padding: 2px;">
                        Author Credit / Copyright Notice
                    </h2>
                    <hr style="width: 90%; color: aliceblue; background-color: aliceblue;">
                    <div style="padding-left: 10px;">
                        <p>
                            This Notification sending system was developed as a practice project under the guidance of
                            the
                            instructor in the YantraYodha Club(ECE), Code Shiksha: Python Bhasha Mastery course.
                        </p>
                        <div
                            style="display: flex; align-items: center; margin-top: 4px; justify-content: space-between; padding-right: 10px; ">
                            <div style="display: flex; align-items: center;">

                                <p style="font-size: 20px;">
                                    Project Implementation & Development: <strong> Pinaka</strong>
                                </p>
                                <img id="Pinaka-DP" alt="Rakesh" style="width: 40px; padding: 6px; border-radius: 100%;"
                                    src="https://github.com/rax-2.png">
                            </div>
                            <a href="https://github.com/rax-2"
                                style="color: #002ec7; font-weight: bolder; font-size: 20px;">
                                🔗[GitHub]
                            </a>

                        </div>
                        <hr style="width: 90%; color:aliceblue; height: 1px; background-color: aliceblue;">
                        <div>
                            <div style="display: flex; justify-content: space-between; padding-right: 10px;">

                                <p style="display: flex;">
                                    &copy;  <strong id="date" style="padding: 0px 4px;"> ${year[1]}</strong>
                                    <strong>Pinaka</strong>.
                                    All rights reserved.
                                </p>
                                <p>
                                    Powerd by <strong>YantraYodha</strong>
                                </p>
                                <a href="https://yyaiem.github.io/yy/" style="color: #002ec7; font-weight: bold;">
                                    🌐[YantraYodha webpage]</a>
                            </div>
                            <p style="color: rgb(235, 43, 0); margin: 10px; font-weight: bold;">
                                This project is created solely for educational and practice purposes.
                                Unauthorized reproduction, distribution, or commercial use of this code or system
                                without prior permission is prohibited
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
  return htmlMailTemplate;
}

function getIndiaDateArray() {
  var tz = "Asia/Kolkata";
  var now = new Date();

  // 1st element: full date-time in India
  var fullDateTime = Utilities.formatDate(now, tz, "dd-MM-yyyy HH:mm:ss");

  // 2nd element: current year in India
  var year = Utilities.formatDate(now, tz, "yyyy");

  return [fullDateTime, year];
}


function sendHiEmail(template = 'API Testing by YantraYodha @$^* ',time = '') {
  let subject = 'Hello, Testing from YantraYodha'

  if (time) {
    subject = `Hey.. MAKAUT Released a new Notice - ${time}`
  }
  // Change this to your email address

  var recipient = "mail1@gmail.com,mail2@gmail.com";
  // MailApp.sendEmail(recipient, "Hi", template); 


  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: template
  });
}

async function getNotice() {
  /**
   * Makaut er notice API theke Latest Notice niye asche
   */
  const API = "<MAKAUT>"
  try {
    const res = UrlFetchApp.fetch(API);
    const json = JSON.parse(res.getContentText());

    const latestNotices = [];
    const allData = json.data;

    for (let i = 0; i < Math.min(allData.length, 12); i++) {
      const data = allData[i];
      latestNotices.push([
        data.notice_date,
        data.notice_title,
        data.file_path,
      ]);
    }
    console.log(latestNotices)

    if (!latestNotices || latestNotices.length === 0) {
      Logger.log("No notices available from API");
      return;
    }

    // Get script properties to remember last notice across runs
    const props = PropertiesService.getScriptProperties();
    let last_notice = props.getProperty("last_published_notice") || "";

    const current_notice = latestNotices[0][1];  // latest notice title

    if (current_notice === last_notice) {
      Logger.log("No new notice published");
      // sendHiEmail()
    } else {
      Logger.log("New notice published");
      props.setProperty("last_published_notice", current_notice);  // update stored notice
      mailStaging(latestNotices);


      // Print all notices with serial numbers
      // latestNotices.forEach((notice, index) => {
      //   Logger.log(
      //     (index + 1) + ". " + notice[0] + " | " + notice[1] + " | " + notice[2]
      //   );
      // });
    }

    return latestNotices;

  } catch (err) {
    Logger.log("Error fetching notices: " + err);
    return [];
  }
}

function mailStaging(latestNotices) {

  let textData = ''
  for (let index = 0; index < latestNotices.length; index++) {

    let date = latestNotices[index][0]
    let title = latestNotices[index][1]
    let url = latestNotices[index][2]

    textHtml = `<div style="width: 100%; padding: 4px; margin: 8px; background-color: #a9e7a1; border-radius: 100px 0px 0px 100px; display:flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; flex-wrap: wrap; width: 80%; margin-left: 16px; font-weight: bold;">
                            <a href="${url}" target="_blank" style="display: flex;">
                               ${title}📄 
                            </a>
                        </div>
                        <div style="width: 20%; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                            <p>
                                📅Published:
                            </p>
                            <p>
                                ${date}
                            </p>
                        </div>
                    </div>`

    textData += textHtml
  }

  // console.log(htmlTemplateMake(textData))
  sendHiEmail(htmlTemplateMake(textData),getIndiaDateArray()[0])
}



// Install the 1-minute trigger (run this once manually)
function setupTrigger() {
  // First, clear old triggers (to avoid duplicates)
  deleteAllTriggers();

  // Create a new time-based trigger to run sendHiEmail every minute
  ScriptApp.newTrigger("getNotice")
    .timeBased()
    .everyMinutes(15)
    .create();
}

// Delete all triggers (use this to stop emails)
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
