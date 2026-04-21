import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../data/questions";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import ChatBubbleSystem from "../components/SystemBubble";
import ChatBubbleUser from "../components/UserBubble";
import ChatOptionButton from "../components/ChatOptionButton";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";

export default function WizardPage() {
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const {
    cakeConfig,
    setCakeConfig,
    chatHistory,
    setChatHistory
  } = useAppFlow();
  
  const currentQuestionIndex = Math.floor((chatHistory?.length || 0) / 2);
  const currentQuestion = questions[currentQuestionIndex];

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

  function handleAnswer(option) {
    if (!currentQuestion) return;

    const key = currentQuestion.key;

    const storedValue = option.vectorValue !== undefined ? option.vectorValue : option.textValue;

    setCakeConfig((prev) => ({
      ...prev,
      [key]: storedValue 
    }));
    
    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: option.label } 
    ];

    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      updatedHistory.push({
        role: "system",
        text: questions[nextIndex].question
      });
      setChatHistory(updatedHistory);
    } else {
      setChatHistory(updatedHistory);
      
      console.log("🚀 SPRINT 1 COMPLETE. FINAL VECTOR PAYLOAD:", {
         ...cakeConfig,
         [key]: storedValue
      });
      
      navigate("/summary");
    }
  }
  function handleReset() {
    setCakeConfig({}); 
    
    setChatHistory([
      {
        role: "system",
        text: questions[0].question
      }
    ]);
  }
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="page-shell">
      <div 
        className="container-narrow" 
        style={{ 
          maxWidth: "820px", 
          minHeight: "70vh", 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px", 
          boxShadow: "0px 10px 22px rgba(0, 0, 0, 0.08)", 
          padding: "10px", 
          borderRadius: "16px", 
          backgroundColor: "#F9F7F4"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Dynamically show step numbers based on total questions */}
          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            Step {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
          </span>
          <PageHeader
            title="Let’s design your cake"
            subtitle="Please select"
          />
        </div>

        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px", 
            height: "40vh", 
            flex: "1",
            overflowY: "auto", 
            backgroundColor: "#FFFFFF", 
            padding: "10px", 
            borderRadius: "10px"
          }}
        >
          {chatHistory.map((item, index) =>
            item.role === "system" ? (
              <ChatBubbleSystem key={index} text={item.text} />
            ) : (
              <ChatBubbleUser key={index} text={item.text} />
            )
          )}
          <div ref={chatEndRef} />
        </div>

        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "80px", 
            backgroundColor: "#FCE7C6", 
            borderRadius: "10px", 
            padding: "10px", 
            justifyContent: "center", 
            alignItems: "center" 
          }}
        >
          {currentQuestion ? (
            <div style={{ display: "flex", flexGrow: "1", gap: "24px", flexDirection: "column", minHeight: "68px", justifyContent: "center"}}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignContent: "flex-start"}}>
                {currentQuestion.options.map((option) => (
                  <ChatOptionButton 
                    key={option.label} 
                    onClick={() => setTimeout(() => handleAnswer(option), 300)}
                  >
                    {option.label} {/* Display the text, but pass the object! */}
                  </ChatOptionButton>
                ))}
              </div>
            </div>
          ) : (
             <div style={{ color: "#888" }}>All questions answered.</div>
          )}
        </div>

          <div className="order-actions" style={{ display: "flex", gap: "16px", paddingTop: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <SecondaryButton 
                onClick={handleReset} 
                style={{ color: "red", borderColor: "red", flex: "1 1 auto" }}
              >
                Start Over
              </SecondaryButton>
              
              <SecondaryButton onClick={() => navigate("/")} style={{ flex: "1 1 auto" }}>
                Back
              </SecondaryButton>
              
              <PrimaryButton onClick={() => navigate("/summary")} style={{ flex: "2 1 auto" }}>
                Skip to Summary
              </PrimaryButton>
          </div>
        
      </div>
    </div>
  );
}