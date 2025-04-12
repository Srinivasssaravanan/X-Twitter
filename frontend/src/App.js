import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { Toaster } from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from './constant/url';
import LoadingSpinner from './components/common/LoadingSpinner';

const App = () => {
  const { data: authUser, isLoading, error } = useQuery({ //We are calling useQuery — a special function from React Query that fetches data and keeps track of its state (loading, success, or error).
  //useQuery returns an object with several useful properties.You’re destructuring just 3 of them from that object:
    queryKey: ["authUser"], //queryKey is like a unique label (or name tag) you give to a specific data fetch.queryKey is like a name tag attached to the fetched data.React Query uses this name to store and find the data in its cache.Whenever a component asks for data with that queryKey.If fresh data exists under that name in the cache — it gives you that instantly.If the data is missing or considered stale (old) — it refetches it using the queryFn
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, { //await is used here to make the code wait for the response from fetch() before moving to the next line. It works only inside an async function.Since fetch() returns a Promise, using await makes sure we wait for the server response before moving to the next step in the code.          This makes the function behave like synchronous code, even though it's asynchronous.
         //fetch() is a built-in JavaScript function that is used to make HTTP requests (like GET, POST, etc.) to a server.It returns a Promise, meaning it's asynchronous and doesn't block the execution of other code while waiting for the response.
          method: "GET",
          credentials: "include",// using credentials: "include", helps to enter the app without username or password when te data is present in cookie.when you login the data is usually stored in cookie for certain period of time.the cookie is sent along with fetching data|||||Every time you make a request to a protected route (like your profile, tweets, likes) — the browser automatically sends this cookie along with the request (if you use credentials: "include" in your fetch request)
          headers: {
            "Content-Type": "application/json",// this header tells the server what type of data you are sending in the request body. When you specify "Content-Type": "application/json", it means that you are sending JSON data in the body of your HTTP request.
          },//json data sending means refering to sending username and password right in my twitter app
        });

        const data = await res.json();//res.json() is used to convert the response body from JSON format into a JavaScript object, making it easier to access.
        if (data.error) return null; // User is not authenticated Returning null helps in avoiding further actions or crashes when the response indicates an error (like an invalid user or authentication failure).


        if (!res.ok) throw new Error(data.error || "Something went wrong");//If the request wasn't successful (e.g., the server returns a 404 or 500), it throws an error with a message.
        return data; // the data got from the http request is stored in the data :authUser
      } catch (err) {
        console.error("Auth fetch error:", err);
        return null; // Return null to avoid crashes
      }
    },
    retry: false,//If the fetch fails, React Query won’t retry it (normally it tries 3 times by default). We disable that by setting retry: false because for auth, if it fails once, no point retrying.
    
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size='lg' />
      </div>
    );
  }
  return ( //This is a container element with Tailwind CSS classes that control the layout. It applies a flexbox layout and sets a maximum width (max-w-6xl) and centers the content (mx-auto).
           //Conditional Rendering: If authUser is true (meaning the user is authenticated), then it renders the Sidebar component. Otherwise, it doesn’t show anything for the sidebar.
           // Yes, you can absolutely put both {authUser && <Sidebar />} and {authUser && <RightPanel />} on the same line
   <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />} 

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
};

export default App;

//cacheTime controls how long the cached data stays in memory after no component is using it.If a query’s data is unused (no components needing it) for cacheTime duration, it gets garbage collected (removed from cache).

//Default: 5 minutes (300,000 ms)


// if i open this twitter website then at first this app component gets executed and checks whether the user have loggin in or not if its status is present then it dont asks for username password if not it asks for it.