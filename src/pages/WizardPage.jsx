import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../data/questions";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import ChatBubbleSystem from "../components/SystemBubble";
import ChatBubbleUser from "../components/UserBubble";
import OptionButton from "../components/OptionButton";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";

export default function WizardPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    setCakeConfig,
    chatHistory,
    setChatHistory
  } = useAppFlow();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: "system",
          text: questions[0].question
        }
      ]);
    }
  }, [chatHistory, setChatHistory]);

  const currentQuestion = questions[currentQuestionIndex];

  function handleAnswer(option) {
    const key = currentQuestion.key;

    setCakeConfig((prev) => ({
      ...prev,
      [key]: option.toLowerCase()
    }));
    
    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: option.toLowerCase() }
    ];

    const nextIndex = currentQuestionIndex + 1;
    console.log(updatedHistory)
    if (nextIndex < questions.length) {
      updatedHistory.push({
        role: "system",
        text: questions[nextIndex].question
      });
      setCurrentQuestionIndex(nextIndex);
      setChatHistory(updatedHistory);
    } else {
      setChatHistory(updatedHistory);
      navigate("/summary");
    }
  }

  return (
    <div className="page-shell">
      <div className="container-narrow" style={{ maxWidth: "820px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Step 1 of 3</span>
          <PageHeader
            title="Let’s design your cake"
            subtitle="Please select"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "420px" }}>
          {chatHistory.map((item, index) =>
            item.role === "system" ? (
              <ChatBubbleSystem key={index} text={item.text} />
            ) : (
              <ChatBubbleUser key={index} text={item.text} />
            )
          )}
        </div>

        {currentQuestion && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {currentQuestion.options.map((option) => (
              <OptionButton key={option} onClick={() => handleAnswer(option)}>
                {option}
              </OptionButton>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "16px" }}>
          <SecondaryButton onClick={() => navigate("/")}>Back</SecondaryButton>
          <PrimaryButton onClick={() => navigate("/summary")}>Skip to Summary</PrimaryButton>
        </div>
      </div>
    </div>
  );
}