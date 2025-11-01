
const pool = require('../Config');

const resumeCreate = async (req, res, next) => {
  try {
    const { user_id, full_name, email,phone, address, profile_summary, education, experience, skills  } = req.body;

     if (!user_id || !full_name || !email || !profile_summary) {
       return res.status(400).json({ message: "Required fields are missing" });
     }

     const educationData = education ? JSON.stringify(education) : '[]';
     const experienceData = experience ? JSON.stringify(experience) : '[]';
     const skillData = skills ? JSON.stringify(skills) : '[]';

     const query = `
       INSERT INTO resumes
       (user_id, full_name, email, phone, address, profile_summary, education, experience, skills)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9)
       RETURNING *;
     `;
    const values = [
      user_id,
      full_name,
      email,
      phone,
      address,
      profile_summary,
      educationData,
      experienceData,     
      skillData
    ];
     const result = await pool.query(query, values);
     res.status(201).json({  message: "Resume created successfully", resume: result.rows[0] });
  } 
  catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const resumeView =async (req, res, next) => {
    try{
      const { id } = req.params;
      if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
        const query = `
      SELECT * FROM resumes
      WHERE id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [id]);
     res.status(200).json({  message: "Resume fetched successfully", resumes: result.rows });
    } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const resumelist = async (req, res, next) => {
 try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const query = `
      SELECT * FROM resumes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id]);

    res.status(200).json({  message: "Resumes fetched successfully", resumes: result.rows });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const resumeEdit = async (req, res, next) => {
 const { id } = req.params;
 const {full_name, email,  phone, address, profile_summary, education, experience, skills } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Resume ID is required" });
  }

    try {
    // Fetch existing resume
    const existing = await pool.query("SELECT * FROM resumes WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }
    const updatedFullName = full_name || existing.rows[0].full_name;
    const updatedEmail = email || existing.rows[0].email;
    const updatedPhone = phone || existing.rows[0].phone;
    const updatedAddress = address || existing.rows[0].address;
    const updatedProfileSummary = profile_summary || existing.rows[0].profile_summary;
    const updatedEducation = education ? JSON.stringify(education) : JSON.stringify(existing.rows[0].education);
    const updatedExperience = experience ? JSON.stringify(experience) : JSON.stringify(existing.rows[0].experience);
    const updatedSkills = skills ? JSON.stringify(skills) : JSON.stringify(existing.rows[0].skills);

    const query = `
      UPDATE resumes
      SET full_name=$1,
          email=$2,
          phone=$3,
          address=$4,
          profile_summary=$5,
          education=$6::jsonb,
          experience=$7::jsonb,
          skills=$8::jsonb,
          updated_at=NOW()
      WHERE id=$9
      RETURNING *;
    `;

    const values = [
      updatedFullName,
      updatedEmail,
      updatedPhone,
      updatedAddress,
      updatedProfileSummary,
      updatedEducation,
      updatedExperience,
      updatedSkills,
      id
    ];

    const result = await pool.query(query, values);

    res.status(200).json({  message: "Resume updated successfully", resume: result.rows[0] });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


module.exports = { resumeCreate, resumelist, resumeView, resumeEdit };