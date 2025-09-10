import API from "./axios";

export interface PollDish {
	dishId: number;
	name: string;
	name_kh?: string;
	description?: string;
	description_kh?: string;
	imageURL?: string;
	categoryId?: number;
	voteCount: number;
}

export interface VotePoll {
	votePollId: number;
	mealDate: string;
	voteDate: string;
	status: string;
	dishes: PollDish[];
}

export const getTodayPoll = async (): Promise<VotePoll> => {
	const res = await API.get<VotePoll>("/polls/today");
	return res.data;
};

export const getTodayPollDishes = async (): Promise<PollDish[]> => {
	const poll = await getTodayPoll();
	return Array.isArray(poll?.dishes) ? poll.dishes : [];
};

export const getHighestVotedPollDish = async (): Promise<PollDish | null> => {
	const poll = await getTodayPoll();
	const dishes = Array.isArray(poll?.dishes) ? poll.dishes : [];
	if (dishes.length === 0) return null;

	let top = dishes[0];
	let topVotes = Number(top.voteCount ?? 0);
	for (let i = 1; i < dishes.length; i++) {
		const d = dishes[i];
		const v = Number(d.voteCount ?? 0);
		if (v > topVotes) {
			top = d;
			topVotes = v;
		}
	}
	return top ?? null;
};

export const getTopThreePollDishes = async (): Promise<Array<{ name: string; description?: string; imageURL?: string | null; voteCount: number }>> => {
	const poll = await getTodayPoll();
	const dishes = Array.isArray(poll?.dishes) ? poll.dishes : [];
	if (dishes.length === 0) return [];

	const sorted = [...dishes].sort((a, b) => (Number(b.voteCount ?? 0) - Number(a.voteCount ?? 0)));
	const top = sorted.slice(0, 3).map(d => ({
		name: d.name ?? '',
		description: d.description ?? d.description_kh ?? '',
		imageURL: d.imageURL ?? null,
		voteCount: Number(d.voteCount ?? 0),
	}));
	return top;
};
