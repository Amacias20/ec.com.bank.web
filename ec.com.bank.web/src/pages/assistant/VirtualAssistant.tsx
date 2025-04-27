import { AssistantService } from "services/Assitant/AssistantService"
import { InputTextarea } from "primereact/inputtextarea"
import { ToastError } from "components/Messages/Toast"
import { useState, useRef, useEffect } from "react"
import { ErrorHandler } from "constants/Global"
import { Button } from "primereact/button"

const containerStyle: React.CSSProperties = {
    height: 'calc(100vh - 107px)',
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "#fff",
    marginTop: '10px',
    maxWidth: '1200px',
    margin: '10px auto',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  }
  
  const headerStyle = {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
  }
  
  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const chatContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    whiteSpace: "pre-wrap",
    scrollBehavior: "smooth",
  }
  
  const messageContainerStyle: React.CSSProperties = {
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    padding: "15px",
    maxWidth: "80%",
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  }
  
  const userMessageStyle = {
    backgroundColor: "#e6f3ff",
    alignSelf: "flex-end",
  }
  
  const messageStyle = {
    margin: "0",
    color: "#333",
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis" as const,
    display: "-webkit-box" as const,
    WebkitLineClamp: 10,
    WebkitBoxOrient: "vertical" as const,
    lineHeight: "1.4",
  }
  
  const inputContainerStyle = {
    display: "flex",
    gap: "10px",
    padding: "20px",
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  }
  
  const inputStyle = {
    flex: 1,
    resize: "none" as const,
    overflow: "auto",
    minHeight: "40px",
    maxHeight: "120px",
    lineHeight: "1.5",
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #e0e0e0",
  }
  const buttonStyle = {
    backgroundColor: "#0066cc",
    border: "none",
    color: "#fff",
    alignSelf: "flex-start",
    width: "40px",
    height: "40px",
    minWidth: "40px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background-color 0.2s",
  }
  const loaderContainerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
  }
  
  const loaderStyle = {
    display: "flex",
    gap: "4px",
  }
  
  const dotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#c2c0c0",
    animation: "loaderAnimation 1.4s infinite ease-in-out both",
  }

const VirtualAssistant = () => {
    const [userMessage, setUserMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "¡Hola! Soy tu asistente virtual. Puedo ayudarte a encontrar información y responder preguntas. ¿Cómo puedo ayudarte hoy?",
    },
  ])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      setMessages([...messages, { type: "user", content: userMessage }])
      setUserMessage("")
      setIsLoading(true)
      if (textareaRef.current) {
        textareaRef.current.style.height = "0px"
      }
      try {
        const response = await AssistantService(userMessage)
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", content: response.response },
        ])

      } catch (error) {
        ToastError(ErrorHandler(error))
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage()
    }
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes loaderAnimation {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          
          @media (max-width: 768px) {
            h1 {
              font-size: 20px !important;
            }
            
            .message-container {
              max-width: 90% !important;
            }
          }
          
          @media (max-width: 480px) {
            .input-container {
              padding: 10px !important;
            }
            
            .chat-container {
              padding: 10px !important;
            }
          }
        `}
      </style>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Asistente Virtual Banco Guayaquil</h1>
      </div>

      <div ref={chatContainerRef} style={chatContainerStyle} className="chat-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className="message-container"
            style={{
              ...messageContainerStyle,
              ...(message.type === "user" ? userMessageStyle : {}),
            }}
          >
            <p style={messageStyle}>{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div style={loaderContainerStyle}>
            <div style={loaderStyle}>
              <div style={{ ...dotStyle, animationDelay: "-0.32s" }}></div>
              <div style={{ ...dotStyle, animationDelay: "-0.16s" }}></div>
              <div style={dotStyle}></div>
            </div>
          </div>
        )}
      </div>

      <div style={inputContainerStyle} className="input-container">
        <InputTextarea
          ref={textareaRef}
          style={inputStyle}
          placeholder="Pregúntame lo que quieras..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          autoResize
        />
        <Button style={buttonStyle} onClick={handleSendMessage}>
          <i className="pi pi-send"></i>
        </Button>
      </div>
    </div>
  )
};  

export default VirtualAssistant;