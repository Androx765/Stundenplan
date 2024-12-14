// Initial Stundenplan-Daten
const initialData = [
    { id: 1, time: "10:00", type: "uni", text: "Uni" },
    { id: 2, time: "11:00", type: "uni", text: "Uni" },
    { id: 3, time: "12:00", type: "uni", text: "Uni" },
    { id: 4, time: "13:00", type: "uni", text: "Uni" },
    { id: 5, time: "14:00", type: "break", text: "Essen" },
    { id: 6, time: "15:00", type: "hobby", text: "Hobby" },
    { id: 7, time: "16:00", type: "hobby", text: "Hobby" },
    { id: 8, time: "17:00", type: "sport", text: "Sport" },
    { id: 9, time: "18:00", type: "sport", text: "Sport" },
  ];
  
  // Zeit-Slots von 8:00 bis 20:00
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
  
  // Speicher- und Lademechanismus
  const saveSchedule = (data) => localStorage.setItem("schedule", JSON.stringify(data));
  const loadSchedule = () => JSON.parse(localStorage.getItem("schedule")) || initialData;
  
  const getCurrentHour = () => {
    const now = new Date();
    return `${now.getHours()}:00`; // Format: "10:00"
  };
  
  const Schedule = {
    data: loadSchedule(),
    currentHour: getCurrentHour(),
  
    oninit: function () {
      // Aktualisiere die aktuelle Stunde jede Minute
      setInterval(() => {
        this.currentHour = getCurrentHour();
        m.redraw(); // Redraw für Mithril
      }, 60000); // Alle 60 Sekunden
    },
  
    view: function () {
      return m(
        "div.schedule",
        timeSlots.map((time) =>
            m(
                "div.time-slot",
                {
                  key: time,
                  "data-time": time,
                  class: time === this.currentHour ? "current-time" : "",
                  style: time === this.currentHour
                    ? { backgroundColor: "rgb(255, 235, 59)", border: "2px solid #ffeb3b" }
                    : {},
                },
                [
                  m("div.time", time),
                  m(
                    "div.slot-content",
                {
                  ondragover: (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  },
                  ondragleave: (e) => e.currentTarget.classList.remove("drag-over"),
                  ondrop: (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
  
                    const id = e.dataTransfer.getData("text/plain");
  
                    // Aktualisiere den Eintrag
                    Schedule.data = Schedule.data.map((entry) =>
                      entry.id === parseInt(id) ? { ...entry, time } : entry
                    );
  
                    // Speicher und aktualisiere die Ansicht
                    saveSchedule(Schedule.data);
                    m.redraw();
                  },
                },
                Schedule.data
                  .filter((entry) => entry.time === time)
                  .map((entry) =>
                    m(
                      "div.entry",
                      {
                        key: entry.id,
                        draggable: true,
                        "data-id": entry.id,
                        "data-type": entry.type,
                        ondragstart: (e) => e.dataTransfer.setData("text/plain", entry.id),
                      },
                      entry.text
                    )
                  )
              ),
            ]
          )
        )
      );
    },
  };

const daysOfWeek = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  const App = {
    view: function () {
        const today = new Date();
        const dayName = daysOfWeek[today.getDay()];
        const date = today.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      return [
        m("h2", `Für ${dayName}, den ${date}`),
        m(Schedule),
      ];
    },
  };
  
  // Mithril App mounten
  m.mount(document.getElementById("app"), App);
  