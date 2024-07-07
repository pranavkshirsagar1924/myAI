// pages/newPage.js

import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import query from "../public/Query";
import { useRouter } from "next/router";
import axios from "axios";

export default function NewPage() {
    const [blog, setBlog] = useState([]);
    const [images, setImages] = useState(null);
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState("");
    const [loader, setLoader] = useState(false);
    const [color, setColor] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoader(true);
                const { tag } = router.query;
                if (tag) {
                    const response = await axios.post("/api/blog", { tag });
                    const { Blog, Images, Tag, Video } = response.data;
                    setBlog(Blog.split(".").map((para) => para.replace(/\*/g, "").trim() + "."));
                    setImages(Images);
                    setTitle(Tag);
                    setVideo(Video);
                    setLoader(false);
                }
            } catch (err) {
                setLoader(false);
                console.log("Error fetching blog:", err);
            }
        }

        if (router.query.tag) {
            fetchData();
        }
    }, [router.query.tag]);

    return (
        <main className={`${styles.main}`}>
            <div className={styles.blogBox}>
                {!loader && <h1 style={{ fontSize: "50px" }}>{title}</h1>}
                {!loader && blog.length > 0 ? (
                    blog.map((para, index) => (
                        <article key={index}>
                            {para}
                            <center>
                                {images && images.length > index && images[index] ? (
                                    <Image
                                        key={index}
                                        src={images[index].src.landscape}
                                        height={600}
                                        width={830}
                                        layout="responsive"
                                        alt={`Image ${index}`}
                                        className={styles.img}
                                    />
                                ) : null}
                            </center>
                            <br />
                            <br />
                        </article>
                    ))
                ) : (
                    <center>
                        <div className={styles.loader}></div>
                    </center>
                )}
                {!loader ? (
                    <div className={styles.videoContainer}>
                        <center>
                            <video controls className={styles.vio}>
                                <source src={video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </center>
                    </div>
                ):null}
            </div>
            <div className={styles.linkBox}>
                {query.map((ele, index) => (
                    <Link key={index} href={`/newPage?tag=${encodeURIComponent(ele.q)}`} className={styles.query}>
                        <p
                            key={index}
                            style={{
                                borderLeft: color === index ? "10px solid #ffff" : "1px solid #fffff",
                            }}
                        >
                            {ele.q}
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
