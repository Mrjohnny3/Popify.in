document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Change icon based on menu state
        const icon = mobileMenuToggle.querySelector('i');
        if (navContainer.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navContainer.classList.contains('active')) {
                navContainer.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navContainer.classList.contains('active') &&
            !navContainer.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)
        ) {
            navContainer.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Command categories switching
    const categories = document.querySelectorAll('.category');
    let autoSwitchInterval;
    let userInteracted = false;
    let currentCategoryIndex = 0;

    // Function to switch to a specific category
    function switchToCategory(categoryIndex) {
        // Get the category element
        const category = categories[categoryIndex];

        // Check if this category is already active
        if (category.classList.contains('active')) {
            return; // Don't switch if it's already the active category
        }

        // Remove active class from all categories
        categories.forEach(c => c.classList.remove('active'));
        // Add active class to the selected category
        category.classList.add('active');

        // Get the active group and the group to show
        const activeGroup = document.querySelector('.command-group.active');
        const groupToShow = document.querySelector(`[data-group="${category.dataset.category}"]`);

        // If there's an active group, fade it out first
        if (activeGroup) {
            // Fade out current active group
            const items = activeGroup.querySelectorAll('.command-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                }, 30 * index);
            });

            // After fade out, remove active class and show new group
            setTimeout(() => {
                // Remove active class from all groups
                document.querySelectorAll('.command-group').forEach(g => {
                    g.classList.remove('active');
                });

                // Show the new group
                if (groupToShow) {
                    groupToShow.classList.add('active');

                    // Add animation to command items
                    const commandItems = groupToShow.querySelectorAll('.command-item');
                    commandItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';

                        setTimeout(() => {
                            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50 * index); // Staggered animation
                    });
                }
            }, 300);
        } else {
            // No active group, just show the new one immediately
            // Remove active class from all groups
            document.querySelectorAll('.command-group').forEach(g => {
                g.classList.remove('active');
            });

            // Show the new group
            if (groupToShow) {
                groupToShow.classList.add('active');

                // Add animation to command items
                const commandItems = groupToShow.querySelectorAll('.command-item');
                commandItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50 * index); // Staggered animation
                });
            }
        }
    }

    // Variables for progress animation
    const progressBar = document.querySelector('.category-progress');
    const switchInterval = 5000; // 5 seconds
    let startTime;

    // Function to animate progress bar
    function animateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / switchInterval * 100, 100);

        // Update progress bar width
        progressBar.style.width = `${progress}%`;

        // Continue animation if not complete and user hasn't interacted
        if (progress < 100 && !userInteracted) {
            requestAnimationFrame(animateProgress);
        } else if (progress >= 100 && !userInteracted) {
            // Reset for next animation
            startTime = null;
            progressBar.style.width = '0%';

            // Move to next category
            currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
            switchToCategory(currentCategoryIndex);

            // Start next animation
            requestAnimationFrame(animateProgress);
        } else if (userInteracted) {
            // User interacted, reset progress bar
            progressBar.style.width = '0%';
        }
    }

    // Function to start auto-switching
    function startAutoSwitch() {
        // Clear any existing interval
        if (autoSwitchInterval) {
            clearInterval(autoSwitchInterval);
        }

        // Start animation
        startTime = null;
        requestAnimationFrame(animateProgress);

        // Set up backup interval in case animation fails
        autoSwitchInterval = setInterval(() => {
            if (!userInteracted) {
                // Move to next category
                currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
                switchToCategory(currentCategoryIndex);

                // Reset progress bar
                progressBar.style.width = '0%';
                startTime = null;
            }
        }, switchInterval);
    }

    // Add click event listeners to categories
    categories.forEach((category, index) => {
        category.addEventListener('click', () => {
            // Set user interaction flag
            userInteracted = true;
            currentCategoryIndex = index;

            // Reset progress bar
            const progressBar = document.querySelector('.category-progress');
            progressBar.style.width = '0%';

            // Switch to clicked category
            switchToCategory(index);

            // Reset auto-switch after 10 seconds of inactivity
            setTimeout(() => {
                userInteracted = false;
                // Restart animation
                requestAnimationFrame(function(timestamp) {
                    startTime = timestamp;
                    animateProgress(timestamp);
                });
            }, 10000);
        });
    });

    // Add mouse movement detection for the commands section
    const commandsSection = document.querySelector('.commands');
    commandsSection.addEventListener('mousemove', () => {
        userInteracted = true;

        // Reset progress bar
        progressBar.style.width = '0%';

        // Reset auto-switch after 10 seconds of inactivity
        clearTimeout(commandsSection.mouseMoveTimeout);
        commandsSection.mouseMoveTimeout = setTimeout(() => {
            userInteracted = false;
            // Restart animation
            requestAnimationFrame(function(timestamp) {
                startTime = timestamp;
                animateProgress(timestamp);
            });
        }, 10000);
    });

    // Generate command groups for other categories
    generateCommandGroups();

    // Generate icon grid
    generateIconGrid();

    // Initialize animations
    initAnimations();

    // Animate initial command items
    setTimeout(() => {
        const activeGroup = document.querySelector('.command-group.active');
        if (activeGroup) {
            const commandItems = activeGroup.querySelectorAll('.command-item');
            commandItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 * index); // Staggered animation
            });
        }

        // Start auto-switching after initial animation
        startAutoSwitch();
    }, 500); // Wait for page to load
});

// Generate command groups for all categories
function generateCommandGroups() {
    const commandList = document.querySelector('.command-list');

    // Music commands - EXPANDED with additional commands
    const musicCommands = `
    <div class="command-group active" data-group="music">
      <h3 class="command-category-title">Music Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">play</div>
          <div class="command-description">Play a song from Spotify, YouTube, or SoundCloud</div>
        </div>
        <div class="command-item">
          <div class="command-name">pause</div>
          <div class="command-description">Pause the current song</div>
        </div>
        <div class="command-item">
          <div class="command-name">resume</div>
          <div class="command-description">Resume the paused song</div>
        </div>
        <div class="command-item">
          <div class="command-name">skip</div>
          <div class="command-description">Skip to the next song in the queue</div>
        </div>
        <div class="command-item">
          <div class="command-name">forceskip</div>
          <div class="command-description">Force skip the current song</div>
        </div>
        <div class="command-item">
          <div class="command-name">stop</div>
          <div class="command-description">Stop playback and clear the queue</div>
        </div>
        <div class="command-item">
          <div class="command-name">queue</div>
          <div class="command-description">View the current queue of songs</div>
        </div>
        <div class="command-item">
          <div class="command-name">clearqueue</div>
          <div class="command-description">Clear all songs from the queue</div>
        </div>
        <div class="command-item">
          <div class="command-name">volume</div>
          <div class="command-description">Adjust the playback volume</div>
        </div>
        <div class="command-item">
          <div class="command-name">shuffle</div>
          <div class="command-description">Shuffle the current queue</div>
        </div>
        <div class="command-item">
          <div class="command-name">loop</div>
          <div class="command-description">Toggle loop mode for current song or queue</div>
        </div>
        <div class="command-item">
          <div class="command-name">autoplay</div>
          <div class="command-description">Toggle autoplay mode for continuous music</div>
        </div>
        <div class="command-item">
          <div class="command-name">join</div>
          <div class="command-description">Make the bot join your voice channel</div>
        </div>
        <div class="command-item">
          <div class="command-name">leave</div>
          <div class="command-description">Make the bot leave the voice channel</div>
        </div>
        <div class="command-item">
          <div class="command-name">seek</div>
          <div class="command-description">Seek to a specific time in the current song</div>
        </div>
        <div class="command-item">
          <div class="command-name">replay</div>
          <div class="command-description">Replay the current song from the beginning</div>
        </div>
        <div class="command-item">
          <div class="command-name">nowplaying</div>
          <div class="command-description">Show information about the currently playing song</div>
        </div>
        <div class="command-item">
          <div class="command-name">search</div>
          <div class="command-description">Search for songs without playing them</div>
        </div>
        <div class="command-item">
          <div class="command-name">grab</div>
          <div class="command-description">Save the current song to your favorites</div>
        </div>
        <div class="command-item">
          <div class="command-name">remove</div>
          <div class="command-description">Remove a specific song from the queue</div>
        </div>
      </div>
    </div>
  `;

    // Filter commands
    const filterCommands = `
    <div class="command-group" data-group="filters">
      <h3 class="command-category-title">Filter Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">8d</div>
          <div class="command-description">Add 8D audio effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">bass</div>
          <div class="command-description">Add bass boost effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">china</div>
          <div class="command-description">Add China effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">darthvader</div>
          <div class="command-description">Add Darth Vader voice effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">daycore</div>
          <div class="command-description">Add daycore effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">doubletime</div>
          <div class="command-description">Add double time effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">earrape</div>
          <div class="command-description">Add earrape effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">electronic</div>
          <div class="command-description">Add electronic music filter to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">equalizer</div>
          <div class="command-description">Adjust audio equalizer settings</div>
        </div>
        <div class="command-item">
          <div class="command-name">karaoke</div>
          <div class="command-description">Add karaoke effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">party</div>
          <div class="command-description">Add party music filter to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">pitch</div>
          <div class="command-description">Adjust pitch of the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">pop</div>
          <div class="command-description">Add pop music filter to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">radio</div>
          <div class="command-description">Add radio effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">rate</div>
          <div class="command-description">Adjust playback rate of the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">reset</div>
          <div class="command-description">Reset all applied filters</div>
        </div>
        <div class="command-item">
          <div class="command-name">slow</div>
          <div class="command-description">Add slow effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">speed</div>
          <div class="command-description">Adjust playback speed of the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">treblebass</div>
          <div class="command-description">Add treble bass effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">tremolo</div>
          <div class="command-description">Add tremolo effect to the music</div>
        </div>
        <div class="command-item">
          <div class="command-name">vaporwave</div>
          <div class="command-description">Add vaporwave effect to the music</div>
        </div>
      </div>
    </div>
  `;

    // Playlist commands
    const playlistCommands = `
    <div class="command-group" data-group="playlist">
      <h3 class="command-category-title">Playlist Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">playlist</div>
          <div class="command-description">Manage and play your playlists</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-removetrack</div>
          <div class="command-description">Remove a specific track from a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-remove</div>
          <div class="command-description">Remove a song from a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-add</div>
          <div class="command-description">Add a song to a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-addnowplaying</div>
          <div class="command-description">Add the currently playing song to a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-addqueue</div>
          <div class="command-description">Add all songs from the current queue to a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-create</div>
          <div class="command-description">Create a new playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-delete</div>
          <div class="command-description">Delete a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-dupes</div>
          <div class="command-description">Remove duplicate songs from a playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-info</div>
          <div class="command-description">View details of a specific playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-list</div>
          <div class="command-description">View all your playlists</div>
        </div>
        <div class="command-item">
          <div class="command-name">pl-load</div>
          <div class="command-description">Load and play a playlist</div>
        </div>
      </div>
    </div>
  `;

    // Utility commands
    const generalCommands = `
    <div class="command-group" data-group="general">
      <h3 class="command-category-title">General Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">afk</div>
          <div class="command-description">Set or remove your AFK status</div>
        </div>
        <div class="command-item">
          <div class="command-name">avatar</div>
          <div class="command-description">Display a user's avatar</div>
        </div>
        <div class="command-item">
          <div class="command-name">banner</div>
          <div class="command-description">Display a user's banner</div>
        </div>
        <div class="command-item">
          <div class="command-name">botinvites</div>
          <div class="command-description">View bot invitation statistics</div>
        </div>
        <div class="command-item">
          <div class="command-name">help</div>
          <div class="command-description">Show all available commands</div>
        </div>
        <div class="command-item">
          <div class="command-name">invite</div>
          <div class="command-description">Get bot invite link</div>
        </div>
        <div class="command-item">
          <div class="command-name">partner</div>
          <div class="command-description">View or manage bot partnerships</div>
        </div>
        <div class="command-item">
          <div class="command-name">ping</div>
          <div class="command-description">Check bot's response time</div>
        </div>
        <div class="command-item">
          <div class="command-name">report</div>
          <div class="command-description">Report a bug or issue to the developers</div>
        </div>
        <div class="command-item">
          <div class="command-name">serverinfo</div>
          <div class="command-description">Display information about the current server</div>
        </div>
        <div class="command-item">
          <div class="command-name">stats</div>
          <div class="command-description">View information about the bot</div>
        </div>
        <div class="command-item">
          <div class="command-name">support</div>
          <div class="command-description">Get support server link</div>
        </div>
        <div class="command-item">
          <div class="command-name">vote</div>
          <div class="command-description">Vote for Candy Bot</div>
        </div>
        <div class="command-item">
          <div class="command-name">uptime</div>
          <div class="command-description">Check how long the bot has been running</div>
        </div>
        <div class="command-item">
          <div class="command-name">votecheck</div>
          <div class="command-description">Check if you have voted for the bot today</div>
        </div>
      </div>
    </div>
  `;

    // Settings commands
    const settingsCommands = `
    <div class="command-group" data-group="settings">
      <h3 class="command-category-title">Settings Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">247</div>
          <div class="command-description">Enable or disable 24/7 mode for the bot</div>
        </div>
        <div class="command-item">
          <div class="command-name">djrole</div>
          <div class="command-description">Set or manage DJ role permissions</div>
        </div>
        <div class="command-item">
          <div class="command-name">history</div>
          <div class="command-description">View the server's music history</div>
        </div>
        <div class="command-item">
          <div class="command-name">clearhistory</div>
          <div class="command-description">Clear the server's music history</div>
        </div>
        <div class="command-item">
          <div class="command-name">prefix</div>
          <div class="command-description">Change the bot's prefix for this server</div>
        </div>
        <div class="command-item">
          <div class="command-name">ignore</div>
          <div class="command-description">Make the bot ignore commands in specific channels</div>
        </div>
        <div class="command-item">
          <div class="command-name">togglesource</div>
          <div class="command-description">Toggle music sources on or off</div>
        </div>
      </div>
    </div>
  `;

    // Spotify commands
    const spotifyCommands = `
    <div class="command-group" data-group="spotify">
      <h3 class="command-category-title">Spotify Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">spotify login</div>
          <div class="command-description">Login to your Spotify account</div>
        </div>
        <div class="command-item">
          <div class="command-name">spotify logout</div>
          <div class="command-description">Logout from your Spotify account</div>
        </div>
        <div class="command-item">
          <div class="command-name">spotify profile</div>
          <div class="command-description">View your Spotify profile information</div>
        </div>
        <div class="command-item">
          <div class="command-name">spotify playlist</div>
          <div class="command-description">Import and play a Spotify playlist</div>
        </div>
        <div class="command-item">
          <div class="command-name">spotify searchplaylist</div>
          <div class="command-description">Search for Spotify playlists</div>
        </div>
      </div>
    </div>
  `;

    // Favourite commands
    const favouriteCommands = `
    <div class="command-group" data-group="favourite">
      <h3 class="command-category-title">Favourite Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">like</div>
          <div class="command-description">Like the current song</div>
        </div>
        <div class="command-item">
          <div class="command-name">playliked</div>
          <div class="command-description">Play your liked songs</div>
        </div>
        <div class="command-item">
          <div class="command-name">clearlikes</div>
          <div class="command-description">Clear all your liked songs</div>
        </div>
        <div class="command-item">
          <div class="command-name">showliked</div>
          <div class="command-description">Show all your liked songs</div>
        </div>
      </div>
    </div>
  `;

    // Profile commands
    const profileCommands = `
    <div class="command-group" data-group="profile">
      <h3 class="command-category-title">Profile Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name">bio</div>
          <div class="command-description">View your profile bio</div>
        </div>
        <div class="command-item">
          <div class="command-name">bioreset</div>
          <div class="command-description">Reset your profile bio</div>
        </div>
        <div class="command-item">
          <div class="command-name">bioset</div>
          <div class="command-description">Set your profile bio</div>
        </div>
        <div class="command-item">
          <div class="command-name">bioshow</div>
          <div class="command-description">Show your bio to others</div>
        </div>
        <div class="command-item">
          <div class="command-name">profile</div>
          <div class="command-description">View your complete profile</div>
        </div>
      </div>
    </div>
  `;

    // Set the HTML content for all command groups
    commandList.innerHTML = musicCommands + filterCommands + playlistCommands +
        generalCommands + settingsCommands +
        spotifyCommands + favouriteCommands + profileCommands;
}

// Generate icon grid
function generateIconGrid() {
    const iconsContainer = document.querySelector('.icons-container');

    // List of icons to display using Font Awesome
    const icons = [{
            name: 'play',
            icon: 'fas fa-play'
        },
        {
            name: 'pause',
            icon: 'fas fa-pause'
        },
        {
            name: 'skip',
            icon: 'fas fa-forward'
        },
        {
            name: 'stop',
            icon: 'fas fa-stop'
        },
        {
            name: 'loop',
            icon: 'fas fa-redo'
        },
        {
            name: 'shuffle',
            icon: 'fas fa-random'
        },
        {
            name: 'volume',
            icon: 'fas fa-volume-up'
        },
        {
            name: 'mute',
            icon: 'fas fa-volume-mute'
        },
        {
            name: 'playlist',
            icon: 'fas fa-list'
        },
        {
            name: 'filter',
            icon: 'fas fa-sliders-h'
        },
        {
            name: 'spotify',
            icon: 'fab fa-spotify'
        },
        {
            name: 'youtube',
            icon: 'fab fa-youtube'
        },
        {
            name: 'soundcloud',
            icon: 'fab fa-soundcloud'
        },
        {
            name: 'deezer',
            icon: 'fas fa-music'
        },
        {
            name: 'apple',
            icon: 'fab fa-apple'
        },
        {
            name: 'radio',
            icon: 'fas fa-broadcast-tower'
        },
        {
            name: '24/7',
            icon: 'fas fa-clock'
        },
        {
            name: 'queue',
            icon: 'fas fa-stream'
        },
        {
            name: 'search',
            icon: 'fas fa-search'
        },
        {
            name: 'grab',
            icon: 'fas fa-download'
        },
        {
            name: 'vote',
            icon: 'fas fa-vote-yea'
        },
        {
            name: 'premium',
            icon: 'fas fa-crown'
        },
        {
            name: 'support',
            icon: 'fas fa-headset'
        },
        {
            name: 'invite',
            icon: 'fas fa-user-plus'
        },
        {
            name: 'help',
            icon: 'fas fa-question-circle'
        },
        {
            name: 'settings',
            icon: 'fas fa-cog'
        },
        {
            name: 'bassboost',
            icon: 'fas fa-volume-down'
        },
        {
            name: 'nightcore',
            icon: 'fas fa-moon'
        },
        {
            name: 'karaoke',
            icon: 'fas fa-microphone'
        },
        {
            name: 'vaporwave',
            icon: 'fas fa-water'
        },
        {
            name: 'equalizer',
            icon: 'fas fa-sliders-h'
        },
        {
            name: 'volume_up',
            icon: 'fas fa-volume-up'
        },
        {
            name: 'volume_down',
            icon: 'fas fa-volume-down'
        },
        {
            name: 'discord',
            icon: 'fab fa-discord'
        },
        {
            name: 'heart',
            icon: 'fas fa-heart'
        },
        {
            name: 'star',
            icon: 'fas fa-star'
        },
        {
            name: 'fire',
            icon: 'fas fa-fire'
        },
        {
            name: 'bolt',
            icon: 'fas fa-bolt'
        },
    ];

    // Create HTML for icons
    let iconsHTML = '';
    icons.forEach(icon => {
        iconsHTML += `
      <div class="icon-item" data-name="${icon.name}" title="${icon.name}">
        <span><i class="${icon.icon}"></i></span>
      </div>
    `;
    });

    // Add icons to container
    iconsContainer.innerHTML = iconsHTML;

    // Add random animation delays to icons
    const iconItems = document.querySelectorAll('.icon-item');
    iconItems.forEach(item => {
        // Add random animation delay
        const randomDelay = Math.random() * 2; // Random delay between 0 and 2 seconds
        item.style.animationDelay = `${randomDelay}s`;

        // Add hover effect
        item.addEventListener('mouseenter', () => {
            // Add a ripple effect on hover
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            item.appendChild(ripple);

            // Add a temporary glow class
            item.classList.add('glow');

            // Remove ripple and glow after animation completes
            setTimeout(() => {
                ripple.remove();
                item.classList.remove('glow');
            }, 1000);
        });
    });
}

// Initialize animations
function initAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .pricing-card, .support-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            // Check if element is in viewport
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    // Initial check
    animateOnScroll();

    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Spotify authentication handling
function handleSpotifyAuth() {
    const callbackElement = document.getElementById('spotify-callback');

    // Check if this is a callback from Spotify
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        // Handle the authentication code
        callbackElement.innerHTML = `<p>Authentication successful You can close this window.</p>`;
        callbackElement.style.display = 'block';

        // You would typically send this code to your server
        // For demo purposes, we'll just show a success message
        setTimeout(() => {
            callbackElement.style.display = 'none';
        }, 5000);
    }
}