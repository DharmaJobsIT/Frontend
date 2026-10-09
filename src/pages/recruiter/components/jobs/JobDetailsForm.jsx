function JobDetailsForm({ job, details, setDetails, editMode }) {
  const updateField = (field, value) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!job) return null;
  const addDuty = () => {
    setDetails((prev) => ({
      ...prev,
      duties: [
        ...prev.duties,
        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateDuty = (index, field, value) => {
    setDetails((prev) => ({
      ...prev,
      duties: prev.duties.map((duty, i) =>
        i === index
          ? {
              ...duty,
              [field]: value,
            }
          : duty,
      ),
    }));
  };

  const removeDuty = (index) => {
    setDetails((prev) => ({
      ...prev,
      duties: prev.duties.filter((_, i) => i !== index),
    }));
  };

  const addListItem = (field) => {
    setDetails((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateListItem = (field, index, value) => {
    setDetails((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeListItem = (field, index) => {
    setDetails((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };
  const addEducationItem = (level) => {
    setDetails((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: [...prev.education[level], ""],
      },
    }));
  };

  const updateEducationItem = (level, index, value) => {
    setDetails((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: prev.education[level].map((item, i) =>
          i === index ? value : item,
        ),
      },
    }));
  };

  const removeEducationItem = (level, index) => {
    setDetails((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: prev.education[level].filter((_, i) => i !== index),
      },
    }));
  };
  // =========================
  // Application Questions
  // =========================

  const addApplicationQuestion = () => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: [
        ...(prev.applicationQuestions || []),
        {
          question: "",
          type: "text",
          options: [],
          required: false,
        },
      ],
    }));
  };

  const updateApplicationQuestion = (index, field, value) => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: (prev.applicationQuestions || []).map(
        (question, i) =>
          i === index
            ? {
                ...question,
                [field]: value,
              }
            : question,
      ),
    }));
  };

  const removeApplicationQuestion = (index) => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: (prev.applicationQuestions || []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const addQuestionOption = (questionIndex) => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: (prev.applicationQuestions || []).map(
        (question, i) =>
          i === questionIndex
            ? {
                ...question,
                options: [...(question.options || []), ""],
              }
            : question,
      ),
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: (prev.applicationQuestions || []).map(
        (question, i) =>
          i === questionIndex
            ? {
                ...question,
                options: (question.options || []).map((option, oi) =>
                  oi === optionIndex ? value : option,
                ),
              }
            : question,
      ),
    }));
  };

  const removeQuestionOption = (questionIndex, optionIndex) => {
    setDetails((prev) => ({
      ...prev,
      applicationQuestions: (prev.applicationQuestions || []).map(
        (question, i) =>
          i === questionIndex
            ? {
                ...question,
                options: (question.options || []).filter(
                  (_, oi) => oi !== optionIndex,
                ),
              }
            : question,
      ),
    }));
  };

  return (
    <div className="mt-8 rounded-2xl bg-gray-50 dark:bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Job Details
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Complete the detailed information for this job.
      </p>

      {/* Existing Job Summary */}

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs text-gray-500">Job Title</label>

          <div className="font-medium">{job.title}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Subject</label>

          <div className="font-medium">{job.subject}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Position</label>

          <div className="font-medium">{job.positionLevel}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Category</label>

          <div className="font-medium">{job.category}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Qualification</label>

          <div className="font-medium">{job.qualification}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Experience</label>

          <div className="font-medium">{job.experienceRequired} Years</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Salary</label>

          <div className="font-medium">{job.salaryRange}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">District</label>

          <div className="font-medium">{job.district}</div>
        </div>
      </div>

      <hr className="my-8 border-gray-300 dark:border-slate-700" />

      {/* Job Purpose */}

      <div>
        <label className="block text-sm font-semibold mb-2">Job Purpose</label>

        <textarea
          rows={5}
          disabled={!editMode}
          value={details.jobPurpose}
          onChange={(e) => updateField("jobPurpose", e.target.value)}
          placeholder="Describe the overall purpose of this role..."
          className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 resize-none"
        />
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Responsibilities</h3>

          {editMode && (
            <button
              type="button"
              onClick={addDuty}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Responsibility
            </button>
          )}
        </div>

        {details.duties.length === 0 && (
          <p className="text-sm text-gray-500">
            No responsibilities added yet.
          </p>
        )}

        <div className="space-y-6">
          {details.duties.map((duty, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-300 dark:border-slate-700 p-4"
            >
              <div className="grid gap-4">
                <input
                  disabled={!editMode}
                  value={duty.title}
                  placeholder="Responsibility Title"
                  onChange={(e) => updateDuty(index, "title", e.target.value)}
                  className="rounded-lg border p-3 dark:bg-slate-800"
                />

                <textarea
                  rows={4}
                  disabled={!editMode}
                  value={duty.description}
                  placeholder="Describe this responsibility..."
                  onChange={(e) =>
                    updateDuty(index, "description", e.target.value)
                  }
                  className="rounded-lg border p-3 resize-none dark:bg-slate-800"
                />

                {editMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeDuty(index)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Key Decisions</h3>

          {editMode && (
            <button
              type="button"
              onClick={() => addListItem("keyDecisions")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Decision
            </button>
          )}
        </div>

        <div className="space-y-3">
          {details.keyDecisions.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                disabled={!editMode}
                value={item}
                placeholder="Key Decision"
                onChange={(e) =>
                  updateListItem("keyDecisions", index, e.target.value)
                }
                className="flex-1 rounded-lg border p-3 dark:bg-slate-800"
              />

              {editMode && (
                <button
                  type="button"
                  onClick={() => removeListItem("keyDecisions", index)}
                  className="px-4 rounded-lg bg-red-600 text-white"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Major Challenges</h3>

          {editMode && (
            <button
              type="button"
              onClick={() => addListItem("majorChallenges")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Challenge
            </button>
          )}
        </div>

        <div className="space-y-3">
          {details.majorChallenges.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                disabled={!editMode}
                value={item}
                placeholder="Major Challenge"
                onChange={(e) =>
                  updateListItem("majorChallenges", index, e.target.value)
                }
                className="flex-1 rounded-lg border p-3 dark:bg-slate-800"
              />

              {editMode && (
                <button
                  type="button"
                  onClick={() => removeListItem("majorChallenges", index)}
                  className="px-4 rounded-lg bg-red-600 text-white"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Skills</h3>

          {editMode && (
            <button
              type="button"
              onClick={() => addListItem("skills")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Skill
            </button>
          )}
        </div>

        <div className="space-y-3">
          {details.skills.map((skill, index) => (
            <div key={index} className="flex gap-3">
              <input
                value={skill}
                disabled={!editMode}
                placeholder="Skill"
                onChange={(e) =>
                  updateListItem("skills", index, e.target.value)
                }
                className="flex-1 rounded-lg border p-3 dark:bg-slate-800"
              />

              {editMode && (
                <button
                  type="button"
                  onClick={() => removeListItem("skills", index)}
                  className="px-4 rounded-lg bg-red-600 text-white"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Employment Details</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2">Employment Type</label>

            <select
              disabled={!editMode}
              value={details.employmentType}
              onChange={(e) => updateField("employmentType", e.target.value)}
              className="w-full rounded-lg border p-3 dark:bg-slate-800"
            >
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Department</label>

            <input
              value={details.department}
              disabled={!editMode}
              onChange={(e) => updateField("department", e.target.value)}
              className="w-full rounded-lg border p-3 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block mb-2">Industry Type</label>

            <input
              value={details.industryType}
              disabled={!editMode}
              onChange={(e) => updateField("industryType", e.target.value)}
              className="w-full rounded-lg border p-3 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block mb-2">Role Category</label>

            <input
              value={details.roleCategory}
              disabled={!editMode}
              onChange={(e) => updateField("roleCategory", e.target.value)}
              className="w-full rounded-lg border p-3 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>
      {/* Education */}

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-6">Education</h3>

        {[
          {
            key: "ug",
            title: "UG Qualifications",
            placeholder: "e.g. B.Sc. Mathematics",
          },
          {
            key: "pg",
            title: "PG Qualifications",
            placeholder: "e.g. M.Sc. Mathematics",
          },
          {
            key: "professional",
            title: "Professional Qualifications",
            placeholder: "e.g. B.Ed., M.Ed., NET, SET, Ph.D.",
          },
        ].map((section) => (
          <div
            key={section.key}
            className="mb-8 rounded-xl border border-gray-300 dark:border-slate-700 p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">{section.title}</h4>

              {editMode && (
                <button
                  type="button"
                  onClick={() => addEducationItem(section.key)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  + Add
                </button>
              )}
            </div>

            {details.education[section.key]?.length === 0 && (
              <p className="text-sm text-gray-500">No qualifications added.</p>
            )}

            <div className="space-y-3">
              {details.education[section.key]?.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    disabled={!editMode}
                    value={item}
                    placeholder={section.placeholder}
                    onChange={(e) =>
                      updateEducationItem(section.key, index, e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
                  />

                  {editMode && (
                    <button
                      type="button"
                      onClick={() => removeEducationItem(section.key, index)}
                      className="px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Application Questions */}

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Application Questions</h3>

            <p className="text-sm text-gray-500 mt-1">
              Add questions that applicants must answer while applying for this
              job.
            </p>
          </div>

          {editMode && (
            <button
              type="button"
              onClick={addApplicationQuestion}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              + Add Question
            </button>
          )}
        </div>

        {(details.applicationQuestions || []).length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-6 text-center">
            <p className="text-sm text-gray-500">
              No application questions added yet.
            </p>

            {editMode && (
              <button
                type="button"
                onClick={addApplicationQuestion}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add your first question
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          {(details.applicationQuestions || []).map((question, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-300 dark:border-slate-700 p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Question {index + 1}</h4>

                {editMode && (
                  <button
                    type="button"
                    onClick={() => removeApplicationQuestion(index)}
                    className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Question
                </label>

                <textarea
                  rows={3}
                  disabled={!editMode}
                  value={question.question || ""}
                  onChange={(e) =>
                    updateApplicationQuestion(index, "question", e.target.value)
                  }
                  placeholder="e.g. Why do you want to join our institution?"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 resize-none"
                />
              </div>

              {/* Type + Required */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Question Type
                  </label>

                  <select
                    disabled={!editMode}
                    value={question.type || "text"}
                    onChange={(e) => {
                      const newType = e.target.value;

                      updateApplicationQuestion(index, "type", newType);

                      if (
                        !["single_choice", "multiple_choice"].includes(newType)
                      ) {
                        updateApplicationQuestion(index, "options", []);
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
                  >
                    <option value="text">Text</option>

                    <option value="textarea">Long Text</option>

                    <option value="number">Number</option>

                    <option value="single_choice">Single Choice</option>

                    <option value="multiple_choice">Multiple Choice</option>

                    <option value="yes_no">Yes / No</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!editMode}
                      checked={Boolean(question.required)}
                      onChange={(e) =>
                        updateApplicationQuestion(
                          index,
                          "required",
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4"
                    />

                    <span className="text-sm font-medium">
                      Required question
                    </span>
                  </label>
                </div>
              </div>

              {/* Options */}
              {["single_choice", "multiple_choice"].includes(question.type) && (
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium">Options</label>

                    {editMode && (
                      <button
                        type="button"
                        onClick={() => addQuestionOption(index)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  {(question.options || []).length === 0 && (
                    <p className="text-sm text-gray-500 mb-3">
                      No options added yet.
                    </p>
                  )}

                  <div className="space-y-3">
                    {(question.options || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-3">
                        <input
                          type="text"
                          disabled={!editMode}
                          value={option}
                          placeholder={`Option ${optionIndex + 1}`}
                          onChange={(e) =>
                            updateQuestionOption(
                              index,
                              optionIndex,
                              e.target.value,
                            )
                          }
                          className="flex-1 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3"
                        />

                        {editMode && (
                          <button
                            type="button"
                            onClick={() =>
                              removeQuestionOption(index, optionIndex)
                            }
                            className="px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Additional Information */}

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

        <textarea
          rows={6}
          disabled={!editMode}
          value={details.additionalInformation}
          onChange={(e) => updateField("additionalInformation", e.target.value)}
          placeholder={`Examples:
• Hostel / Accommodation
• Staff Quarters
• Free Transport
• Food Facility
• PF / ESI
• Working Hours
• Weekend Schedule
• Joining Date
• Other Benefits`}
          className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 resize-none"
        />
      </div>
    </div>
  );
}

export default JobDetailsForm;
