import axios from 'axios';
import FormData from 'form-data';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

const stabilityService = {
    // ... (rest of the code remains similar but cleaner) ...
    generateImage: async (prompt) => {
        if (!STABILITY_API_KEY) return null;

        // Using SDXL 1.0
        const engineId = 'stable-diffusion-xl-1024-v1-0';
        const apiHost = 'https://api.stability.ai';
        const url = `${apiHost}/v1/generation/${engineId}/text-to-image`;

        try {
            const response = await axios.post(url, {
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${STABILITY_API_KEY}`
                }
            });

            if (response.data && response.data.artifacts) {
                // Return base64 or save file
                return response.data.artifacts[0].base64; // Returning base64 for immediate frontend display
            }
        } catch (error) {
            console.error("Stability Image Error:", error.response ? error.response.data : error.message);
            return null;
        }
        return null;
    },

    generateVideo: async (prompt) => {
        if (!STABILITY_API_KEY) return null;

        // 1. Generate Image First
        const base64Image = await stabilityService.generateImage(prompt);
        if (!base64Image) return null;

        // 2. Call Image-to-Video (SVD)
        const url = `https://api.stability.ai/v2beta/image-to-video`;

        // We need FormData for this
        const form = new FormData();
        const buffer = Buffer.from(base64Image, 'base64');

        form.append('image', buffer, { filename: 'image.png' });
        form.append('seed', '0');
        form.append('cfg_scale', '1.8');
        form.append('motion_bucket_id', '127');

        try {
            const response = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${STABILITY_API_KEY}`
                }
            });

            // The response is usually a generation ID
            const generationId = response.data.id;
            return generationId; // Frontend will need to poll for this
        } catch (error) {
            console.error("Stability Video Error:", error.response ? error.response.data : error.message);
            return null;
        }
    },

    getVideoResult: async (generationId) => {
        const url = `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${STABILITY_API_KEY}`,
                    Accept: 'video/*'
                },
                responseType: 'arraybuffer'
            });

            if (response.status === 202) {
                return { status: 'pending' };
            } else if (response.status === 200) {
                // Finish
                return { status: 'complete', buffer: response.data };
            }
        } catch (e) {
            return { status: 'error' };
        }
    }
};

export default stabilityService;
