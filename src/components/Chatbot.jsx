import { FaRobot } from "react-icons/fa";
import { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi, I’m YN! Ask me anything." },
    ]);

    const predefinedButtons = [
        "Give me a tour!",
        "What are your interests?",
        "Show me your resume.",
        "Tell me about UMass.",
    ];

    const [input, setInput] = useState("");
    const [isTouring, setIsTouring] = useState(false);
    const [tourText, setTourText] = useState("");

    const toggleChat = () => {
        setIsOpen(!isOpen);
        const el = document.querySelector(".chatbot-box");
        if (el) {
            el.classList.toggle("closed");
        }
        const btn = document.querySelector(".chatbot-toggle");
        btn.classList.toggle("active");
        const container = document.querySelector(".chatbot-container");
        if (isOpen) {
            setTimeout(() => {
                container.style.width = "50px";
                container.style.height = "50px";
            }, 500);
        } else {
            container.style.width = "400px";
            container.style.height = "400px";
        }
    };

    const sendMessage = async () => {
        if (input.trim() === "") return;
        const trimmedInput = input.trim();
        var response = "I'm not sure how to respond to that. For further questions, feel free to reach out to me through the contact page or refer to the buttons below.";
        if (trimmedInput === "Give me a tour!") {
            response = "Sure! I can guide you through a tour of our features.";
            startTour();
        } else if (trimmedInput === "What are your interests?") {
            response =
                "I’m interested in technology, artificial intelligence, and solving real-world problems through innovative solutions. I enjoy learning new things, exploring creative ideas, and helping others by providing useful information and support.";
        } else if (trimmedInput === "Show me your resume.") {
            response = "You can download my resume directly from the home page.";
        } else if (trimmedInput === "Tell me about UMass.") {
            response = "UMass is a great university located in Amherst, Massachusetts. It offers a wide range of programs and has a vibrant campus life.";
        }
        setInput("");
        await addUserInput(trimmedInput);
        await addBotReply(response);
    };

    async function addUserInput(input) {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: input },
        ]);
        setTimeout(() => {
            const el = document.querySelector(".chatbot-messages");
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }, 100);
    }

    async function addBotReply(response) {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: response },
        ]);
        setTimeout(() => {
            const el = document.querySelector(".chatbot-messages");
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }, 100);
    }

    async function startTour() {
        await addBotReply("Starting the tour in...");
        await delay(1000);
        await addBotReply("3");
        await delay(1000);
        await addBotReply("2");
        await delay(1000);
        await addBotReply("1");
        await delay(1000);
        await addBotReply("Let's begin the tour!");
        await delay(1000);
        toggleChat();
        window.history.pushState({}, "", "/#home");
        await delay(400);
        setIsTouring(true);
        setTourText(
            "Welcome to my portfolio! Here you can find information about my experience, projects, skills, and how to contact me. Let's start with my experience."
        );
        await delay(3000);
        window.history.pushState({}, "", "/#experience");
        setTourText(
            "These are some spaces I've contributed in and added value to. After this, let me take you through some projects I'm proud of!"
        );
        await delay(3000);
        window.history.pushState({}, "", "/#projects");
        setTourText(
            "These are some of the projects I've worked on. Each project reflects my skills and interests. Next, let's explore my skills and the technologies I work with."
        );
        await delay(3000);
        window.history.pushState({}, "", "/#skills");
        setTourText(
            "These are the technical skills I bring to the table. I'm always eager to learn more! Upcoming: Ways to contact me so that maybe we could build something awesome together!"
        );
        await delay(3000);
        window.history.pushState({}, "", "/#contact");
        setTourText("There are a LOT of ways to reach me.");
        await delay(3000);
        window.history.pushState({}, "", "/#home");
        setTourText(
            "So that was the tour! Hope you had a ton of fun and know all about me now!"
        );
        await delay(3000);
        setIsTouring(false);
        setTourText("");
    }

    function delay(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }

    return (
        <>
            {isTouring && (
                <div className="fixed bottom-[20px] w-[80%] left-1/2 transform -translate-x-1/2 bg-purple-300 text-black px-4 py-2 rounded shadow z-100 text-center">
                    <p className="font-semibold">{tourText}</p>
                </div>
            )}

            <div className="chatbot-container text-black">
                <button className="chatbot-toggle" onClick={toggleChat}>
                    <FaRobot size={24} />
                </button>

                <div className="chatbot-box">
                    {/* Message display */}
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chatbot-msg ${msg.sender}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Predefined buttons ABOVE input */}
                    <div className="chatbot-quick-buttons px-4 py-2 flex flex-wrap gap-2">
                        {predefinedButtons.map((btn, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(btn)}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>

                    {/* Input field */}
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage(input)
                            }
                            placeholder="Type your message..."
                            required
                        />
                        <button onClick={() => sendMessage(input)}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
