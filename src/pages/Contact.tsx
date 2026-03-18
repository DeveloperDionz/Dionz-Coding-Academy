const Contact = () => {
  return (
    <div className="bg-yellow-50 min-h-screen text-black">
    <div className="container mx-auto py-20">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <h1 className="text-2xl font-semibold mb-4">We are here to help</h1>
      <p>Email: support@dionzacademy.com</p>
      <p>Office: Paran Business Centre- Office 28, Rongai.</p>
      <p>Hours: Monday – Friday, 9:00 AM – 6:00 PM (EAT)</p><br></br>
      <h2 className="text-xl font-bold mb-4">Support Form</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input type="text" id="name" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input type="email" id="email" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
          <input type="text" id="subject" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">Message</label>
          <textarea id="message" rows={4} className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default Contact;