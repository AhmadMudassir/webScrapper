const { remote } = require('webdriverio');
const { Parser } = require('json2csv');
const fs = require('fs');


const startingRollNo = 43406;
const endingRollNo = 43408;
const url = 'http://pu.edu.pk/home/results_show/7471';

(async () => {

  const results = [];
  for (let i = startingRollNo; i <= endingRollNo; i++) {
    const browser = await remote({
      capabilities: {
        browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu']
      }
      },
    })
    await browser.url(url);
    const rollNumberInput = await browser.$('input[name="roll_no"]');
    await rollNumberInput.waitForExist();
    await rollNumberInput.setValue(String(i));

    const getResultButton = await browser.$( 'input[name="submitcontact"]');
    await getResultButton.click();
    const pageContents = await browser.$$('div.pagecontents');
    // console.log(await Promise.all(pageContents.map((el) => el.getText())));
    const result = await Promise.all(pageContents.map((el) => el.getText()))
    const noSpaces = result[0].replace(/\s+/g, '');
    // console.log('hehehehehe===========',noSpaces)
    if (noSpaces.includes('ResultsSomeErrors')) {
      console.log(`Skipping roll number ${i}`);
      await browser.deleteSession();
      continue;
    }



    const rollNo = noSpaces.match(/RollNo\.(\d+)/i)[1];

    const name = noSpaces.match(/Name(.+?)FatherName/i)[1].replace(/([A-Z])/g, ' $1').trim();

    const fatherName = noSpaces.match(/FatherName(.+?)RegistrationNo/i)[1].replace(/([A-Z])/g, ' $1').trim();

    const registrationNo = noSpaces.match(/RegistrationNo.(\d+-ctl-\d+)/i)[1];

    // console.log(noSpaces)

    let cgpa;
    if (noSpaces.includes('(PrvFailin')) {
      // Without Spaces
      const cgpaMatch = noSpaces.match(/TOTALCGPA(\d+\.\d+\(.*?\))Back/i);
      cgpa = cgpaMatch[1];
      // console.log(cgpa);

      // This gives only first but with Spaces and stuff
      // const cgpaMatch = noSpaces.match(/CGPA([\d.]+)\((.*?)\)/i);
      // cgpa = `${cgpaMatch[1]} (${cgpaMatch[2].replace(/([a-z])([A-Z])/g, '$1 $2')})`;
      // cgpa += ')'; // Add closing parenthesis
      // cgpa = cgpa.replace('Failin', 'Fail in');
      // console.log(cgpa); // Print the CGPA
    } else {
      cgpa = Number(noSpaces.match(/CGPA([\d.]+)/i)[1]);
      // console.log(cgpa); // Print the CGPA
    }

    let Degree = noSpaces.match(/Degree(.*?\d+)/)[1].replace(/RollNo.*$/, '').replace(/Name.*$/, '').trim().replace(/`/g, "'");
    Degree = Degree.replace(/`s/g, "s "); // Replacing "`s" with "s " to form "Bachelor's Studies"
    Degree = Degree.replace(/([a-z])([A-Z])/g, "$1 $2"); // Inserting space between words

    // const NameOfInstitution = noSpaces.match(/SEMESTER CREDIT HOURS.*?\n(.*)\d/)[1].replace(/\d/, '').trim();
    const regex = /NameofInstitutionSEMESTERCREDITHOURSGPA(.+?)\d+/;
    const match = noSpaces.match(regex);
    let nameOfInstitution = match ? match[1] : null;
    nameOfInstitution = nameOfInstitution.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/,/g, ', ');

    const semesterCreditHour = Number(noSpaces.match(/SEMESTERCREDITHOURSGPAGovernmentGraduateCollege,Township,Lahore(\d+)/i)[1]);

// Creating an object with the extracted fields
    const data = {
     rollno: rollNo,
     Name: name,
     FatherName: fatherName,
     RegistrationNo: registrationNo,
     CGPA: cgpa,
     Degree: Degree,
     NameOfInstitution: nameOfInstitution,
    SemesterCreditHour: semesterCreditHour
    };
    // console.log(data);
    results.push(data)
    await browser.deleteSession();
  }
  // console.log(results)
  const json = JSON.stringify(results)
  console.log(json)
  // const fields = ['rollno', 'Name', 'FatherName', 'RegistrationNo', 'CGPA', 'Degree', 'NameOfInstitution', 'SemesterCreditHour'];
  //
  // const opts = { fields };
  //
  // try {
  //   const parser = new Parser(opts);
  //   const csv = parser.parse(results); // 'data' is the array of objects you want to convert to CSV
  //   fs.writeFileSync(`${path}.csv`, csv);
  //   console.log('CSV file saved!');
  // } catch (err) {
  //   console.error(err);
  // }
})();
