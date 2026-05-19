import React from "react";

const SheduleFormPopup = () => {
  return (
    {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full transition-all duration-300 z-10"
                >
                  <FaTimes />
                </button>
    
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCalendarAlt className="text-3xl text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Schedule a Meeting
                    </h3>
                    <p className="text-gray-600">
                      Pick a convenient time to discuss your dream property
                    </p>
                  </div>
    
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert(
                        "Meeting Scheduled Successfully! Our team will contact you soon.",
                      );
                      setIsModalOpen(false);
                      setMeetingData({
                        name: "",
                        email: "",
                        phone: "",
                        date: "",
                        time: "",
                        message: "",
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={meetingData.name}
                          onChange={(e) =>
                            setMeetingData({ ...meetingData, name: e.target.value })
                          }
                          placeholder="Your Name"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={meetingData.phone}
                          onChange={(e) =>
                            setMeetingData({
                              ...meetingData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Your Phone"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all"
                        />
                      </div>
                    </div>
    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={meetingData.email}
                        onChange={(e) =>
                          setMeetingData({ ...meetingData, email: e.target.value })
                        }
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all"
                      />
                    </div>
    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            required
                            value={meetingData.date}
                            onChange={(e) =>
                              setMeetingData({
                                ...meetingData,
                                date: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Preferred Time
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            required
                            value={meetingData.time}
                            onChange={(e) =>
                              setMeetingData({
                                ...meetingData,
                                time: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Message (Optional)
                      </label>
                      <textarea
                        rows="2"
                        value={meetingData.message}
                        onChange={(e) =>
                          setMeetingData({
                            ...meetingData,
                            message: e.target.value,
                          })
                        }
                        placeholder="Any specific property you're interested in?"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all resize-none"
                      ></textarea>
                    </div>
    
                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-600/30 flex items-center justify-center gap-2 mt-4"
                    >
                      <FaPaperPlane />
                      Book Meeting Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
  )
};

export default SheduleFormPopup;
