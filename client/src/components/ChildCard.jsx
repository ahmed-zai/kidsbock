function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function ChildCard({ child }) {
  const age = child.dob ? calculateAge(child.dob) : 'N/A';

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img src={child.avatar_url || '/avatar-placeholder.png'} alt={child.name} className="w-24 h-24 object-cover rounded-full mb-2"/>
      <h3 className="font-semibold">{child.name}</h3>
      <p className="text-sm text-gray-600">Age: {age}</p>
      <p className="text-sm text-gray-600">Reading Level: {child.reading_level}</p>
    </div>
  );
}

