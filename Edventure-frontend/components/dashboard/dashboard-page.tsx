import Image from "next/image";

// Update the course data with proper Unsplash image URLs
const courses = [
  {
    id: 1,
    title: "UI/UX Design Fundamentals",
    description: "Learn the basics of user interface and experience design",
    progress: 75,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    id: 2,
    title: "Frontend Web Development",
    description: "Master HTML, CSS, and JavaScript for modern web development",
    progress: 45,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications",
    progress: 30,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    id: 4,
    title: "Introduction to Design Thinking",
    description: "Learn the principles of design thinking methodology",
    progress: 60,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&auto=format&q=80",
  },
]

// Update the Image component usage in the JSX
<Image
  src={course.image}
  alt={course.title}
  width={400}
  height={200}
  className="rounded-t-lg object-cover"
  priority
/> 