import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function fetchBlog(req, res) {
  const GENAPI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENAPI_KEY);
  const pexelsImage = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  const generation_config = {
    "candidate_count": 1,
    "max_output_tokens": 256,
    "temperature": 1.0,
    "top_p": 0.7,
  }
  
  const safety_settings=[
    {
      "category": "HARM_CATEGORY_DANGEROUS",
      "threshold": "BLOCK_NONE",
    },
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_NONE",
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_NONE",
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_NONE",
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_NONE",
    },
  ]
  
  try {
    const model = GENAPI.getGenerativeModel({model:"gemini-pro"});
    const chat = model.startChat(
        generation_config,
        safety_settings
    );
    const querry = req.body.tag;
    const blog = await chat.sendMessage(`write a 3000 word blog about ${querry} write every para point wise don't add bullets or numeric bullets keep it simple and write the blog with all proper grammar`); // Send a prompt to the generative model
    const blogText = await blog.response.text(); // Await the text response from the model

    const pexelsResponse = await axios.get(`https://api.pexels.com/v1/search?query=${querry}&per_page=4`, {
      headers: {
        Authorization: pexelsImage,
      },
    });
    const pexelVideo = await axios.get(`https://api.pexels.com/videos/search?query=${querry}&per_page=1`,{
      headers:{
        Authorization:pexelsImage
      }
    })

    const images = pexelsResponse.data.photos;
    const videoUrl = pexelVideo.data.videos[0].video_files[0].link;
    console.log(videoUrl)
    res.status(200).json({ Blog: blogText, Images: images,Tag:querry,Video:videoUrl});
  } catch (err) {
    console.error('Error generating blog:', err);
    res.status(500).json({ error: 'Error generating blog' });
  }
}
