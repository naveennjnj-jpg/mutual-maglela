import {
  Facebook,
  Instagram,
  X,
  Linkedin,
  Youtube,
  Pinterest,
} from "iconoir-react";

const socials = [
  {
    id: 1,
    icon: Facebook,
    link: "https://www.facebook.com/vCareProjectManagement/",
  },
  {
    id: 2,
    icon: Instagram,
    link: "https://www.instagram.com/vcareprojectmanagement/",
  },
    {
    id: 3,
    icon: Youtube,
    link: "https://www.youtube.com/channel/UCWg9sBRmPCcpVy2KY5AtjQQ",
  },
  {
    id: 4,
    icon: X,
    link: "https://x.com/vCare_official",
  },
    {
    id: 5,
    icon: Pinterest,
    link: "https://au.pinterest.com/vCareProjectManagement/",
  },
  {
    id: 6,
    icon: Linkedin,
    link: "https://www.linkedin.com/company/vcare-project-management-pty-ltd/",
  },

];

const SocialIcons = () => {
  return (
    <div className="flex items-center gap-1">
      {socials.map(({ id, icon: Icon, link }) => (
        <a
          key={id}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-primary_blue flex items-center justify-center 
                     hover:bg-primary_heading transition-all"
        >
          <Icon className="text-white w-4 h-4" strokeWidth={2} />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
