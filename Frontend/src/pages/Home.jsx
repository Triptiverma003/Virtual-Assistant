import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ai from "../assets/ai.gif"
import userAi from "../assets/userAi.gif"
import { CgMenuRight } from "react-icons/cg"
import { RxCross1 } from "react-icons/rx"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis
  const [ham, setHam] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error)
        }
      }
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) utterance.voice = hindiVoice

    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()
      }, 800)
    }

    synth.cancel()
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)
    const encodedQuery = encodeURIComponent(userInput)

    switch (type) {
      case 'google-search':
        window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank')
        break
      case 'calculator-open':
        window.open(`https://www.google.com/search?q=calculator`, '_blank')
        break
      case 'instagram-open':
        window.open(`https://www.instagram.com/`, '_blank')
        break
      case 'facebook-open':
        window.open(`https://www.facebook.com/`, '_blank')
        break
      case 'weather-show':
        window.open(`https://www.google.com/search?q=weather`, '_blank')
        break
      case 'youtube-search':
      case 'youtube-play':
        window.open(`https://www.youtube.com/results?search_query=${encodedQuery}`, '_blank')
        break
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    let isMounted = true
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start")
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e)
        }
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start()
            console.log("Recognition restarted")
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e)
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start()
            console.log("Recognition restarted after error")
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e)
          }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`)
    greeting.lang = 'hi-IN'
    window.speechSynthesis.speak(greeting)

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Mobile Hamburger */}
      <CgMenuRight className="lg:hidden text-white absolute top-5 right-5 w-7 h-7 cursor-pointer" onClick={() => setHam(true)} />

      {/* Sidebar Menu (Mobile) */}
      <div className={`absolute lg:hidden top-0 left-0 w-full h-full bg-black/60 backdrop-blur-lg z-50 transition-transform duration-300 ${ham ? "translate-x-0" : "translate-x-full"} flex flex-col px-6 py-4`}>
        <RxCross1 className="text-white absolute top-5 right-5 w-7 h-7 cursor-pointer" onClick={() => setHam(false)} />
        <div className="mt-16 flex flex-col gap-5">
          <button onClick={handleLogout} className="bg-white text-black font-semibold rounded-full py-3 px-6 hover:bg-gray-200 transition">Log Out</button>
          <button onClick={() => navigate("/customize")} className="bg-white text-black font-semibold rounded-full py-3 px-6 hover:bg-gray-200 transition">Customize Assistant</button>
          <div className="h-px bg-gray-400 my-3"></div>
          <h1 className="text-white text-lg font-semibold">History</h1>
          <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
        {userData.history?.map((his)=>(
        <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
        ))}

</div>
        </div>
      </div>

      {/* Desktop Top Right Buttons */}
      <div className="hidden lg:flex gap-4 absolute top-5 right-5 z-30">
        <button onClick={() => navigate("/customize")} className="bg-white text-black font-semibold rounded-full py-2 px-5 hover:bg-gray-200 transition">Customize Assistant</button>
        <button onClick={handleLogout} className="bg-red-500 text-white font-semibold rounded-full py-2 px-5 hover:bg-red-600 transition">Log Out</button>
      </div>

      {/* Assistant Avatar */}
      <div className="w-[260px] h-[260px] md:w-[300px] md:h-[300px] overflow-hidden rounded-3xl shadow-lg border-2 border-white">
        <img src={userData?.assistantImage} alt="assistant" className="object-cover w-full h-full" />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white text-2xl mt-6 font-semibold">
        I'm <span className="text-blue-400">{userData?.assistantName}</span>
      </h1>

      {/* AI Status Animation */}
      <div className="mt-6">
        {!aiText ? (
          <img src={userAi} alt="Listening" className="w-[160px] animate-pulse" />
        ) : (
          <img src={ai} alt="Speaking" className="w-[160px]" />
        )}
      </div>

      {/* Voice/Text Output */}
      {userText || aiText ? (
        <div className="mt-4 max-w-[80%] md:max-w-[600px] bg-white/10 text-white text-base text-center font-medium p-3 rounded-lg shadow-inner backdrop-blur-sm">
          {userText || aiText}
        </div>
      ) : null}
    </div>
  )
}

export default Home
