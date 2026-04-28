const TermsOfService = () => {
  return (
    <div className="bg-yellow-50 min-h-screen dark:bg-black/100 dark:text-white">
    <div className="container mx-auto py-20">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p>The "Ground Rules":</p>
      <ul className="list-disc list-inside mb-6">
        <li><b>Account Sharing:</b> Accounts are for individual use. Sharing login credentials may result in account suspension.</li>
        <li><b>Refunds:</b> We offer a 14-day "No Questions Asked" refund policy if you haven't completed more than 20% of the course.</li>
      </ul>
      <p><b>Code of Conduct:</b> Respect fellow students in the community forums. Harassment or "toxic" behavior is not tolerated.</p>
    </div>
    </div>
  );
};

export default TermsOfService;