"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Filter, Edit2, Trash2, ArrowLeft, UserPlus, Users, X, Star, Sparkles, BadgeCheck } from "lucide-react";

export default function ProfilePage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
    skills: [],
  });
  const [roleSearch, setRoleSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const roleDropdownRef = useRef(null);
  const skillDropdownRef = useRef(null);

  // Available roles and skills for dropdowns
  const availableRoles = [
    "Frontend Developer",
    "Backend Developer", 
    "Full Stack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Data Scientist",
    "Mobile Developer",
    "Product Manager",
    "QA Engineer",
    "Team Lead",
    "Software Architect",
    "Cloud Engineer"
  ];

  const availableSkills = [
    "React", "JavaScript", "TypeScript", "CSS", "HTML", "Tailwind",
    "Node.js", "Python", "SQL", "MongoDB", "PostgreSQL", "Redis",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD",
    "Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing",
    "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch",
    "React Native", "Flutter", "Vue.js", "Angular", "Svelte",
    "PHP", "Java", "C#", "Go", "Rust", "Ruby"
  ];

  // Filter roles and skills based on search
  const filteredRoles = availableRoles.filter(role =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and selected skill
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((user) =>
        user.skills.some((skill) =>
          skill.toLowerCase().includes(selectedSkill.toLowerCase())
        )
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedSkill]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setIsAddingUser(false);
        setFormData({ name: "", role: "", avatar: "", skills: [] });
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        setEditingUser(null);
        setFormData({ name: "", role: "", avatar: "", skills: [] });
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      skills: user.skills,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setIsAddingUser(false);
    setFormData({ name: "", role: "", avatar: "", skills: [] });
  };

  const toggleSkill = (skill) => {
    const currentSkills = formData.skills;
    if (currentSkills.includes(skill)) {
      setFormData({
        ...formData,
        skills: currentSkills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...currentSkills, skill]
      });
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  // Get all unique skills for filter dropdown
  const allSkills = [...new Set(users.flatMap((user) => user.skills))];

  // Modern color schemes for skills - subtle backgrounds with dark text
  const getSkillColor = (skill) => {
    const colors = {
      // Frontend - Cool tones
      React: "bg-blue-50 border-blue-200 text-blue-800",
      JavaScript: "bg-amber-50 border-amber-200 text-amber-800",
      TypeScript: "bg-indigo-50 border-indigo-200 text-indigo-800",
      CSS: "bg-purple-50 border-purple-200 text-purple-800",
      HTML: "bg-orange-50 border-orange-200 text-orange-800",
      Tailwind: "bg-cyan-50 border-cyan-200 text-cyan-800",
      Vue: "bg-emerald-50 border-emerald-200 text-emerald-800",
      Angular: "bg-red-50 border-red-200 text-red-800",
      Svelte: "bg-orange-50 border-orange-200 text-orange-800",
      
      // Backend - Warm tones
      "Node.js": "bg-green-50 border-green-200 text-green-800",
      Python: "bg-blue-50 border-blue-200 text-blue-800",
      SQL: "bg-indigo-50 border-indigo-200 text-indigo-800",
      MongoDB: "bg-emerald-50 border-emerald-200 text-emerald-800",
      PostgreSQL: "bg-blue-50 border-blue-200 text-blue-800",
      Redis: "bg-red-50 border-red-200 text-red-800",
      PHP: "bg-purple-50 border-purple-200 text-purple-800",
      Java: "bg-red-50 border-red-200 text-red-800",
      Go: "bg-cyan-50 border-cyan-200 text-cyan-800",
      Rust: "bg-orange-50 border-orange-200 text-orange-800",
      Ruby: "bg-red-50 border-red-200 text-red-800",
      
      // DevOps & Cloud - Neutral tones
      Docker: "bg-blue-50 border-blue-200 text-blue-800",
      Kubernetes: "bg-blue-50 border-blue-200 text-blue-800",
      AWS: "bg-orange-50 border-orange-200 text-orange-800",
      Azure: "bg-blue-50 border-blue-200 text-blue-800",
      GCP: "bg-green-50 border-green-200 text-green-800",
      "CI/CD": "bg-gray-50 border-gray-200 text-gray-800",
      
      // Design - Creative tones
      Figma: "bg-purple-50 border-purple-200 text-purple-800",
      "Adobe XD": "bg-pink-50 border-pink-200 text-pink-800",
      Sketch: "bg-orange-50 border-orange-200 text-orange-800",
      Prototyping: "bg-indigo-50 border-indigo-200 text-indigo-800",
      Wireframing: "bg-gray-50 border-gray-200 text-gray-800",
      
      // Data Science - Technical tones
      "Machine Learning": "bg-orange-50 border-orange-200 text-orange-800",
      "Data Analysis": "bg-teal-50 border-teal-200 text-teal-800",
      TensorFlow: "bg-orange-50 border-orange-200 text-orange-800",
      PyTorch: "bg-red-50 border-red-200 text-red-800",
      
      // Mobile - Modern tones
      "React Native": "bg-blue-50 border-blue-200 text-blue-800",
      Flutter: "bg-cyan-50 border-cyan-200 text-cyan-800"
    };

    return colors[skill] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  const getRoleColor = (role) => {
    const colors = {
      "Frontend Developer": "bg-blue-100 text-blue-800",
      "Backend Developer": "bg-green-100 text-green-800",
      "Full Stack Developer": "bg-purple-100 text-purple-800",
      "UI/UX Designer": "bg-pink-100 text-pink-800",
      "DevOps Engineer": "bg-orange-100 text-orange-800",
      "Data Scientist": "bg-teal-100 text-teal-800",
      "Mobile Developer": "bg-indigo-100 text-indigo-800",
      "Product Manager": "bg-amber-100 text-amber-800",
      "QA Engineer": "bg-gray-100 text-gray-800",
      "Team Lead": "bg-red-100 text-red-800",
      "Software Architect": "bg-purple-100 text-purple-800",
      "Cloud Engineer": "bg-cyan-100 text-cyan-800"
    };

    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Team Profiles
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto border-gray-300 hover:border-gray-400 bg-white">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <Button 
                onClick={() => setIsAddingUser(true)} 
                className="gap-2 w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expertise Areas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{allSkills.length}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Star className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active View</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filteredUsers.length}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-300 focus:border-gray-400 focus:ring-gray-400 rounded-xl bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white appearance-none"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {(isAddingUser || editingUser) && (
          <Card className="mb-8 border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <BadgeCheck className="w-5 h-5" />
                {editingUser ? "Edit Team Member" : "Add Team Member"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="focus:border-gray-400 focus:ring-gray-400 rounded-lg py-2 bg-white"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-3" ref={roleDropdownRef}>
                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
                      >
                        <span className={formData.role ? "text-gray-900" : "text-gray-500"}>
                          {formData.role || "Select role"}
                        </span>
                        <Plus className="w-4 h-4 text-gray-400 transform rotate-45" />
                      </button>
                      
                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          <div className="p-2 border-b border-gray-200">
                            <Input
                              placeholder="Search roles..."
                              value={roleSearch}
                              onChange={(e) => setRoleSearch(e.target.value)}
                              className="border-0 focus:ring-0 bg-gray-50"
                            />
                          </div>
                          <div className="py-1">
                            {filteredRoles.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, role });
                                  setShowRoleDropdown(false);
                                  setRoleSearch("");
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Avatar URL</Label>
                    <Input
                      value={formData.avatar}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                      className="focus:border-gray-400 focus:ring-gray-400 rounded-lg py-2 bg-white"
                    />
                  </div>

                  <div className="space-y-3" ref={skillDropdownRef}>
                    <Label className="text-sm font-medium text-gray-700">Skills</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                        className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
                      >
                        <span className="text-gray-500">Select skills</span>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {showSkillDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          <div className="p-2 border-b border-gray-200">
                            <Input
                              placeholder="Search skills..."
                              value={skillSearch}
                              onChange={(e) => setSkillSearch(e.target.value)}
                              className="border-0 focus:ring-0 bg-gray-50"
                            />
                          </div>
                          <div className="py-1">
                            {filteredSkills.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                  formData.skills.includes(skill) ? "bg-gray-50" : ""
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${getSkillColor(skill).split(' ')[0]}`}></div>
                                {skill}
                                {formData.skills.includes(skill) && (
                                  <div className="ml-auto w-2 h-2 bg-gray-600 rounded-full"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Skills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getSkillColor(skill)}`}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all rounded-lg px-6"
                  >
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    {editingUser ? "Update Member" : "Add Member"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelEdit}
                    className="border-gray-300 hover:bg-gray-50 rounded-lg px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white overflow-hidden"
            >
              <CardHeader className="text-center pb-4 pt-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-sm relative z-10"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white z-20"></div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">{user.name}</CardTitle>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} mt-2`}>
                  {user.role}
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getSkillColor(skill)} hover:shadow-sm transition-shadow`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      onClick={() => startEdit(user)}
                      className="flex-1 gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all rounded-lg"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">
              {users.length === 0
                ? "No team members yet"
                : "No matching profiles found"}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              {users.length === 0
                ? "Get started by adding your first team member"
                : "Try adjusting your search criteria"}
            </p>
            {users.length === 0 && (
              <Button 
                onClick={() => setIsAddingUser(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white gap-2 shadow-sm hover:shadow-md transition-all rounded-lg px-6"
              >
                <UserPlus className="w-4 h-4" />
                Add First Member
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}