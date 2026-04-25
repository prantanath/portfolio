import {project} from "./interfaces";

export const projectsList : project[] = [
  {
    title: 'HomeSchool - A CLASSROOM MANAGEMENT APP',
    description: 'The project includes user login, registration by role, creating and joining\n' +
      'classrooms, creating posts and comments, and creating assignment and grading\n' +
      'functions.',
    technologies: ['Django','Python','MySQL'],
    link: 'https://github.com/prantanath/homeschool',
    live: '',
  },
  {
    title: 'CODEGRINDER – A PROGRAMMING PROBLEM RECOMMENDER',
    description: 'It extracts information that is publicly available from the specified coding profiles,\n' +
      'analyzes it, and recommends problem based on user rating and their desired\n' +
      'tags.',
    technologies: ['Html', 'Css', 'Js' , 'Php'],
    link: 'https://github.com/prantanath/codeGrinder',
    live: 'https://codegrinder.000webhostapp.com/',
  },
  {
    title: 'MUSIX',
    description: 'Web app utilizing a public API to stream music. Implemented play and stop ' +
      'buttons, handled user interactions for playback control, and integrated a ' +
      'progress bar and timer to track song duration.',
    technologies: ['Angular', 'Tailwind CSS', 'TypeScript'],
    link: 'https://github.com/prantanath/musix',
    live: 'https://musix-200ea.web.app/',
  },
  {
    title: 'ALOPECIA CLASSIFICATION USING TRANSFER LEARNING',
    description: 'Developed a deep learning model for alopecia classification using transfer learning with MobileNet, OpenCV preprocessing, and data augmentation. ' +
      'Fine-tuned hyperparameters for better accuracy, and deployed for real-world use.',
    technologies: ['Flask','Angular', 'Tensorflow', 'OpenCV','Docker'],
    link: 'https://github.com/prantanath/alopecia-classification-backend',
    live: 'https://alopecia-classification-frontend.vercel.app/',
  }
  // Add more projects as needed
];
